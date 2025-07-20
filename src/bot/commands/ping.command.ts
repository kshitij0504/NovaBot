import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../interfaces/command.interface';

const PingCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    await interaction.reply('🏓 Pong from handler!');
  },
};

export default PingCommand;
