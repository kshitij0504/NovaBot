import { GeminiService } from './ai/gemini.service';
import { BotModule } from './bot/bot.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/gemini.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, BotModule, AiModule],
  controllers: [AppController],
  providers: [GeminiService, AppService],
})
export class AppModule {}
