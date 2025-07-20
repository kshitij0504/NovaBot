import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { SlashCommand } from '../interfaces/command.interface';
import { GeminiService } from '../../ai/gemini.service';

const AskCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask Gemini AI anything!')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('Your question for Gemini')
        .setRequired(true),
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');
    const gemini = interaction.client['geminiService'] as GeminiService;

    const answer = await gemini.askGemini(question!);

    await interaction.editReply(answer);
  },
};

export default AskCommand;
