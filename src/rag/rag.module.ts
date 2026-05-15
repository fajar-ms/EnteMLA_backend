import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; // Added this
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { KnowledgeBase, KnowledgeBaseSchema } from './kb.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(), // Added this to enable Cron jobs
    MongooseModule.forFeature([
      { name: 'KnowledgeBase', schema: KnowledgeBaseSchema }
    ]),
  ],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}