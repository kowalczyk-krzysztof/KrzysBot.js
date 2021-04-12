import puppeteer, { Browser, Page } from 'puppeteer';
import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { TempleEmbed } from '../../utils/embed';

export const rsn = async (
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
      `https://templeosrs.com/player/names.php?player=${keyword}`,
      {
        waitUntil: 'networkidle0',
      }
    );

    const data: string[] = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('table.competition-table:nth-of-type(2) td')
      ).map((column: Element) => column.innerHTML);
    });

    await browser.close();

    if (data !== undefined && data.length > 0) {
      const names: string[] = [];
      data.map((el: string, index: number) => {
        if (index % 4 === 0) names.push(el);
      });
      const set: string = Array.from(new Set(names)).join('\n');
      const embed: TempleEmbed = new TempleEmbed().addField('Names', `${set}`);

      return msg.channel.send(embed);
    } else if (data.length === 0) return msg.channel.send('User not found');
    else return msg.channel.send('Error');
  } catch (err) {
    return msg.channel.send('Error');
  }
};
