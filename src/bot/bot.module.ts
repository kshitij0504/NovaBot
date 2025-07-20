import { GeminiService } from 'src/ai/gemini.service';
import { BotService } from './bot.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [BotService, GeminiService],
})
export class BotModule {}
