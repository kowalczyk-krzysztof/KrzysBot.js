import puppeteer, { Browser, Page } from 'puppeteer';
import { Message, MessageEmbed } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';

// TODO: DRY

export const ehp = async (
  msg: Message,
  ...args: string[]
): Promise<Message> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string | string[] = stringOrArray(...args);
  try {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    await page.goto(
      `https://templeosrs.com/player/overview.php?player=${keyword}`,
      {
        waitUntil: 'networkidle0',
      }
    );

    const data: string[] | undefined = await page.evaluate(() => {
      const title: Element | null = document.querySelector(
        'div[class="stat-display"] > p:nth-child(1)'
      );
      const ehp: Element | null = document.querySelector(
        'div[class="stat-display"] > p:nth-child(2)'
      );
      if (ehp !== null && title !== null) {
        const data = [title.innerHTML.slice(1, -1), ehp.innerHTML.slice(1)];
        return data;
      }
    });

    await browser.close();

    if (data !== undefined) {
      const embed: MessageEmbed = new MessageEmbed()
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
