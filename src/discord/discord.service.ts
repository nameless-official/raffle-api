// src/discord/discord.service.ts

import { Injectable } from '@nestjs/common';
import * as Discord from 'discord.js';

@Injectable()
export class DiscordService {
  private readonly client: Discord.Client;

  constructor() {
    this.client = new Discord.Client({ intents: [] });
    this.initialize();
  }

  private initialize() {
    this.client.on('ready', () => {
      console.log('Bot is ready.');
    });

    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }

  async isUserInServer(userId: string, serverId: string = process.env.DEVTALLES_SERVER_ID): Promise<boolean> {
    try {
      const server = await this.client.guilds.fetch(serverId);
      if (!server) {
        throw new Error('Server not found.');
      }
      const member = await server.members.fetch(userId);
      return !!member;
    } catch (error) {
      return false;
    }
  }
}
