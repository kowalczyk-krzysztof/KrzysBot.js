// Discord
import { MessageEmbed } from 'discord.js';

// Username field
export const usernameString: string = 'USERNAME:';

// General embed
export class Embed extends MessageEmbed {
  constructor() {
    super();
    this.setColor('#E67E22');
  }
}
// OSRS embed
export class OsrsEmbed extends Embed {
  constructor() {
    super();
    this.setFooter('Incorrect? Fetch latest data:\n.osrsfetch username');
  }
}
// TempleOSRS embed
export class TempleEmbed extends Embed {
  constructor() {
    super();
    this.setDescription(
      `Data provided by: [TempleOSRS](https://templeosrs.com/ 'TempleOSRS')`
    );
    this.setFooter(
      'Incorrect? Fetch latest data:\n.templefetch data-type username'
    );
  }
}
// Error embed
export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setDescription(`**Something went wrong...**`);
  }
}
// Embed titles
export enum EmbedTitles {
  BH = 'BH',
  CLUES = 'CLUES',
  LVL = 'LEVEL',
  KC = 'BOSSES',
  LEAGUEPTS = 'LEAGUE POINTS',
  SOULWARS = 'SOUL WARS',
  LMS = 'LMS',
  RECORDS = 'RECORDS',
  GAINS = 'GAINS',
  TOPBOSS = 'MOST KILLED BOSS',
  TOPSKILL = 'TOP SKILL',
  GP_EARNED = 'GP EARNED',
  GP_SPENT = 'GP SPENT',
}
