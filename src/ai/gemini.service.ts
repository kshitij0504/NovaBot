import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class GeminiService {
  // Corrected the URL to use v1beta
  private readonly GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(private configService: ConfigService) {}

  async askGemini(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
    log(`Asking Gemini with prompt: ${prompt}`);
    
    try {
      const response = await axios.post(
        `${this.GEMINI_URL}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Gemini didn't return a valid answer."
      );
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      return '❌ Error communicating with Gemini.';
    }
  }
}