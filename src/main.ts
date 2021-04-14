import dotenv from 'dotenv';
import { Client } from 'discord.js';
import { commandHandler } from './commandHandler';

dotenv.config({ path: 'config.env' });

const AUTH_TOKEN: string = process.env.AUTH_TOKEN as string;

const client: Client = new Client();

client.on('ready', () => {
  console.log(`Connected`);
});

client.on('message', commandHandler);

client.login(`${AUTH_TOKEN}`);
