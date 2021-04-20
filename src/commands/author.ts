// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Anti-spam
import { antiSpam } from '../cache/antiSpam';
import { Embed } from '../utils/embed';

dotenv.config({ path: 'config.env' });
const githubLink: string = process.env.GITHUB_LINK as string;

export const author = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  else
    return msg.channel.send(
      new Embed().addField(
        `HELLO!`,
        `My name is **Krzysztof** and I'm happy to provide you with **EfficiencyBOT**\n\nIf you have any questions, feature requests or bug reports, feel free to contact me on my [GitHub](${githubLink} 'GitHub') or message me on Discord:\n\n\`\`\`krzys#7414\n(UNIQUE ID: 792752768406257705)\`\`\``
      )
    );
};
