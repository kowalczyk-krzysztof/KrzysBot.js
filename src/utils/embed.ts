import { MessageEmbed } from 'discord.js';

// Username field
export const usernameString: string = 'Username';

// General embed
export class Embed extends MessageEmbed {
  constructor() {
    super();
    this.setColor('#E67E22');
  }
}

// TempleOSRS embeds
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

export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setDescription(`**Something went wrong...**`);
  }
}
// Everything related to how OSRS command embed should look like
// Title field
export enum EmbedTitles {
  BH = 'BH',
  CLUES = 'CLUES',
  LVL = 'LEVEL',
  KC = 'BOSSES',
  LEAGUEPTS = 'LEAGUE POINTS',
  SOULWARS = 'SOUL WARS',
  LMS = 'LMS',
  RECORDS = 'RECORDS',
}
// OSRS embed
export class OsrsEmbed extends Embed {
  constructor() {
    super();
    this.setFooter('Incorrect? Fetch latest data:\n.osrsfetch username');
  }
}
