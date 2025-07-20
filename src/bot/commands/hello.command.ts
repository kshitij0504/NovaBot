import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../interfaces/command.interface';

const HelloCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Replies with a personalized greeting!'),

  async execute(interaction) {
    const username = interaction.user.username;
    await interaction.reply(`👋 Hello, **${username}**!`);
  },
};

export default HelloCommand;
