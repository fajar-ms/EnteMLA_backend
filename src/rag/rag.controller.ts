import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('chat')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async ask(@Body() body: { question: string; lang?: string }) {
    // 1. Extract question and lang from the request body
    const { question, lang } = body;

    // 2. The Service MUST use this 'lang' to determine the AI output language
    const answer = await this.ragService.askQuestion(question, lang || 'English');

    // 3. Return consistent JSON
    return { 
      answer,
      language: lang || 'English',
      timestamp: new Date().toISOString()
    };
  }
}