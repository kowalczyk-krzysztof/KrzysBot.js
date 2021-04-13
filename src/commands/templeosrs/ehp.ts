import puppeteer, { Browser, Page } from 'puppeteer';
import { Message } from 'discord.js';
// Utils
import { runescapeNameValidator } from '../../utils/runescapeNameValidator';
import { stringOrArray } from '../../utils/stringOrArray';
import { TempleEmbed } from '../../utils/embed';

let localCache: { [key: string]: any } = {};

export const ehp = async (
  msg: Message,
  ...args: string[]
): Promise<Message> => {
  const nameCheck: boolean = runescapeNameValidator(...args);
  if (nameCheck === false) return msg.channel.send('Invalid username');
  const keyword: string = stringOrArray(...args);
  if (Object.keys(localCache).length > 100) localCache = {};

  if (keyword in localCache) {
    const result = localCache[keyword];

    const embed: TempleEmbed = new TempleEmbed().addFields(
      { name: 'Username', value: `${args.join(' ')}` },
      { name: `${result[0]}`, value: `${result[1]}` },
      { name: `Rank`, value: `${result[2]}` }
    );
    return msg.channel.send(embed);
  } else {
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
        const rank: Element | null = document.querySelector(
          'div[class="stat-display"] > a > p'
        );
        if (ehp !== null && title !== null) {
          // This check is done so if user doesn't exist (his page exists either way) it won't throw an error and instead result rank as unranked
          if (rank !== null) {
            const data: string[] = [
              title.innerHTML,
              ehp.innerHTML,
              rank.innerHTML,
            ];

            return data;
          } else {
            const data: string[] = [title.innerHTML, ehp.innerHTML, 'Unranked'];

            return data;
          }
        }
      });

      await browser.close();

      if (data !== undefined) {
        localCache[keyword] = data;
        const embed: TempleEmbed = new TempleEmbed().addFields(
          { name: 'Username', value: `${args.join(' ')}` },
          { name: `${data[0]}`, value: `${data[1]}` },
          { name: `Rank`, value: `${data[2]}` }
        );

        return msg.channel.send(embed);
      } else return msg.channel.send('Error');
    } catch (err) {
      return msg.channel.send('Error');
    }
  }
};
