// Discord
import { Client } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Command handler
import { commandHandler } from './commandHandler';

dotenv.config({ path: 'config.env' });

// Auth token
const AUTH_TOKEN: string = process.env.AUTH_TOKEN as string;

const client: Client = new Client();

client.on('ready', () => {
  console.log(`Connected`);
});

client.on('message', commandHandler);

client.login(`${AUTH_TOKEN}`);
