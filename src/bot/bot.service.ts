import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { SlashCommand } from './interfaces/command.interface';

@Injectable()
export class BotService implements OnModuleInit {
  private client: Client;
  private commands = new Map<string, SlashCommand>();

  constructor(private configService: ConfigService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async onModuleInit() {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    const clientId = this.configService.get<string>('DISCORD_CLIENT_ID');
    const guildId = this.configService.get<string>('DISCORD_GUILD_ID');

    await this.loadCommands();

    if (!token || !clientId || !guildId) {
      throw new Error('Missing Discord environment variables');
    }

    const commands = [
      new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .toJSON(),
    ];

    const rest = new REST({ version: '10' }).setToken(token);

    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: Array.from(this.commands.values()).map((cmd) =>
          cmd.data.toJSON(),
        ),
      });
      console.log('✅ Commands registered');
    } catch (error) {
      console.error('❌ Command registration failed', error);
    }

    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const command = this.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction as ChatInputCommandInteraction);
      } catch (error) {
        console.error('❌ Error executing command:', error);
        await interaction.reply({
          content: 'Something went wrong!',
          ephemeral: true,
        });
      }
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot || !message.content) return;

      const content = message.content.toLowerCase();
      const greetings = ['hi', 'hello', 'hey', 'yo', 'sup'];

      if (greetings.some((greet) => content.startsWith(greet))) {
        await message.reply(`Hey ${message.author.username}! 👋`);
      }
    });

    this.client.once('ready', () => {
      console.log(`🤖 Logged in as ${this.client.user?.tag}`);
    });

    await this.client.login(token);
  }

  private async loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(
        (file) => file.endsWith('.command.js') || file.endsWith('.command.ts'),
      );

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const imported = await import(filePath);
      const command: SlashCommand =
        imported.default || imported[Object.keys(imported)[0]];

      if (!command?.data?.name) {
        console.warn(`⚠️ Skipped loading ${file} — invalid command structure.`);
        continue;
      }

      this.commands.set(command.data.name, command);
    }
  }
}
