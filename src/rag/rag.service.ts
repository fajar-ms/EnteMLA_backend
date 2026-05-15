import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChatGroq } from "@langchain/groq";
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { MongoClient, ChangeStream } from 'mongodb';
import { PromptTemplate } from '@langchain/core/prompts';
import { Embeddings } from '@langchain/core/embeddings';
import axios from 'axios';
import * as cheerio from 'cheerio';

class GeminiEmbeddingsV1 extends Embeddings {
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, model = 'gemini-embedding-001') {
    super({});
    this.apiKey = apiKey;
    this.modelName = model;
  }

  async embedQuery(text: string): Promise<number[]> {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:embedContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${this.modelName}`,
          content: { parts: [{ text }] },
          outputDimensionality: 768,
        }),
      }
    );
    const data = await res.json();
    if (!data.embedding || !data.embedding.values) {
      throw new Error(`Embedding failed: ${JSON.stringify(data)}`);
    }
    return data.embedding.values;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      const embedding = await this.embedQuery(text);
      results.push(embedding);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return results;
  }
}

@Injectable()
export class RagService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RagService.name);
  private embeddings: GeminiEmbeddingsV1;
  private llm: ChatGroq;
  private vectorStore: MongoDBAtlasVectorSearch | null = null;
  private client: MongoClient | null = null;
  private changeStream: ChangeStream | null = null;
  private readonly COLLECTION_NAME = 'faqs';

  constructor(private configService: ConfigService) {
    const geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    const groqApiKey = this.configService.get<string>('GROQ_API_KEY');

    if (!geminiApiKey || !groqApiKey) throw new Error('API Keys missing');

    this.embeddings = new GeminiEmbeddingsV1(geminiApiKey);
    this.llm = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });
  }

  async onModuleInit() {
    await this.initVectorStore();
    await this.watchForChanges();

    const collection = this.client!.db().collection(this.COLLECTION_NAME);
    const count = await collection.countDocuments();

    if (count === 0) {
      this.logger.log('🌱 Database empty. Seeding initial knowledge...');
      await collection.insertOne({
        content: "EnteMLA is an AI-powered platform designed to help users interact with their representatives and learn about local governance in Kerala.",
        source: "manual-seed",
        updatedAt: new Date()
      });
    }

    setTimeout(() => {
      this.crawlWebsite('http://127.0.0.1:3000');
    }, 5000);
  }

  async onModuleDestroy() {
    if (this.changeStream) await this.changeStream.close();
    if (this.client) await this.client.close();
    this.logger.log('🔌 Connections closed safely.');
  }

  private async initVectorStore() {
    const uri = this.configService.get<string>('MONGODB_URI');
    this.client = new MongoClient(uri!);
    await this.client.connect();

    this.vectorStore = new MongoDBAtlasVectorSearch(this.embeddings, {
      collection: this.client.db().collection(this.COLLECTION_NAME) as any,
      indexName: 'vector_index',
      textKey: 'content',
      embeddingKey: 'embedding',
    });
    this.logger.log('✅ Vector Store Connected');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledCrawl() {
    this.logger.log('⏰ Starting scheduled knowledge update...');
    await this.crawlWebsite('http://127.0.0.1:3000');
  }

  async crawlWebsite(url: string) {
    this.logger.log(`🌐 Attempting to learn from: ${url}`);
    try {
      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const textChunks: string[] = [];

      $('main p, article p, h1, h2, h3, li').each((_, el) => {
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        if (text.length > 20) textChunks.push(text);
      });

      const collection = this.client!.db().collection(this.COLLECTION_NAME);
      for (const chunk of textChunks) {
        await collection.updateOne(
          { content: chunk },
          { $set: { content: chunk, source: url, updatedAt: new Date() } },
          { upsert: true }
        );
      }
      this.logger.log(`📚 Success! Ingested ${textChunks.length} sections.`);
    } catch (e) {
      this.logger.warn(`⚠️ Scraping failed for ${url}.`);
    }
  }

  private async watchForChanges() {
    if (!this.client) return;
    const collection = this.client.db().collection(this.COLLECTION_NAME);
    this.changeStream = collection.watch([], { fullDocument: 'updateLookup' });

    this.changeStream.on('change', async (change: any) => {
      const { operationType, fullDocument } = change;
      if (['insert', 'update', 'replace'].includes(operationType) && fullDocument) {
        if (!fullDocument.embedding || fullDocument.embedding.length !== 768) {
          await this.embedDocument(fullDocument);
        }
      }
    });
    this.logger.log('👀 Real-time sync active.');
  }

  private async embedDocument(doc: any) {
    try {
      const text = doc.content || `${doc.question} ${doc.answer}`;
      const embedding = await this.embeddings.embedQuery(text);
      await this.client!.db().collection(this.COLLECTION_NAME).updateOne(
        { _id: doc._id },
        { $set: { embedding } }
      );
      this.logger.log(`✨ Generated vector (768) for: ${doc._id}`);
    } catch (e) {
      this.logger.error(`❌ Embedding failed: ${e.message}`);
    }
  }

  // ✅ FIX: Build language-specific instructions separately so they never bleed into each other
  private getLanguageInstructions(lang: string): string {
    if (lang === 'Malayalam') {
      return `
    ### LANGUAGE: You MUST respond ONLY in Malayalam (മലയാളം). Do not use English under any circumstances.
    
    ### MALAYALAM QUALITY RULES:
    1. Do not use literal word-for-word translations. Transcreate English facts into natural, conversational, polite Malayalam.
    2. Always use "തദ്ദേശ ഭരണം" for Local Governance. NEVER use "സ്ഥാനിക ഭരണം".
    3. Always use "ജനപ്രതിനിധികൾ" for Representatives.
    4. If the user greets you (Hi, Hello, നമസ്കാരം), respond with: "നമസ്കാരം! എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?"
    5. NEVER use "എന്തുകൊണ്ട്" (Why) to mean "എങ്ങനെ" (How).
    6. Use respectful, official Malayalam phrasing used in Kerala governance.`;
    }

    if (lang === 'Hindi') {
      return `
    ### LANGUAGE: You MUST respond ONLY in Hindi (हिन्दी). Do not use English or Malayalam under any circumstances.
    
    ### HINDI QUALITY RULES:
    1. Use natural, conversational, and polite Hindi.
    2. If the user greets you (Hi, Hello, नमस्ते), respond with: "नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?"
    3. Use respectful tone appropriate for government/governance context.`;
    }

    // Default: English
    return `
    ### LANGUAGE: You MUST respond ONLY in English. Do not use Malayalam, Hindi, or any other language under any circumstances.
    
    ### ENGLISH QUALITY RULES:
    1. Use clear, professional, and polite English.
    2. If the user greets you (Hi, Hello), respond with: "Hello! How can I assist you today?"
    3. Use respectful tone appropriate for a governance platform.`;
  }

  async askQuestion(question: string, lang: string = 'English'): Promise<string> {
    if (!this.vectorStore) await this.initVectorStore();

    this.logger.log(`🌐 askQuestion called — lang: "${lang}", question: "${question}"`);

    const retriever = this.vectorStore!.asRetriever({ k: 4 });
    const docs = await retriever.invoke(question);

    if (docs.length === 0) {
      if (lang === 'Malayalam') {
        return "ക്ഷമിക്കണം, ഇതിനെക്കുറിച്ചുള്ള വിവരങ്ങൾ എന്റെ ഡാറ്റാബേസിൽ ലഭ്യമല്ല.";
      }
      if (lang === 'Hindi') {
        return "क्षमा करें, मेरे डेटाबेस में इस विषय पर पर्याप्त जानकारी उपलब्ध नहीं है।";
      }
      return "I'm sorry, I don't have enough information in my database yet.";
    }

    const context = docs.map((d) => d.pageContent).join('\n\n');

    // ✅ FIX: Language instructions are built separately and are mutually exclusive
    const languageInstructions = this.getLanguageInstructions(lang);

    const template = `
    You are the professional EnteMLA Assistant, representing local governance in Kerala.
    Answer the user accurately using ONLY the provided context.

    ${languageInstructions}

    ### STRICT RULE:
    Your entire response must be in ${lang} only. Every single word. No exceptions.

    Context: {context}
    Question: {question}
    Answer:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const finalPrompt = await prompt.format({ context, question });

    const result = await this.llm.invoke(finalPrompt);
    return result.content as string;
  }
}