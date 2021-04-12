import puppeteer from 'puppeteer';
import { Message, MessageEmbed } from 'discord.js';
import { runescapeNameValidator } from '../utils/runescapeNameValidator';

// TODO: DRY

export const ehp = async (
  msg: Message,
  ...args: string[]
): Promise<Message> => {
  const nameCheck = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');

  let keyword: string | string[];
  if (args.length > 1) keyword = args;
  else keyword = args[0];
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      `https://templeosrs.com/player/overview.php?player=${keyword}`,
      {
        waitUntil: 'networkidle0',
      }
    );

    const data = await page.evaluate(() => {
      const title = document.querySelector(
        'div[class="stat-display"] > p:nth-child(1)'
      );
      const ehp = document.querySelector(
        'div[class="stat-display"] > p:nth-child(2)'
      );
      if (ehp !== null && title !== null) {
        const data = [title.innerHTML.slice(1, -1), ehp.innerHTML.slice(1)];
        return data;
      }
    });

    await browser.close();

    if (data !== undefined) {
      const embed = new MessageEmbed()
        .setColor('#E67E22')
        .addFields(
          { name: 'Username', value: `${args.join(' ')}` },
          { name: `${data[0]}`, value: `${data[1]}` }
        );
      return msg.channel.send(embed);
    } else return msg.channel.send('Error');
  } catch (err) {
    return msg.channel.send('Error');
  }
};
