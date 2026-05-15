import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class KnowledgeBase extends Document {
  @Prop({ required: true })
  text: string; // The text information the AI will read

  @Prop({ type: [Number], required: true })
  embedding: number[]; // The vector array for Atlas Search

  @Prop()
  category: string; // Optional: To filter data later
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);