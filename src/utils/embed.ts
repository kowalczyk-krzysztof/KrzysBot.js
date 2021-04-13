import { MessageEmbed } from 'discord.js';

export class Embed extends MessageEmbed {
  constructor() {
    super();
    this.setColor('#E67E22');
  }
}

export class TempleEmbed extends Embed {
  constructor() {
    super();
    this.setDescription(
      `Data provided by: [TempleOSRS](https://templeosrs.com/ 'TempleOSRS')`
    );
    this.setFooter('Incorrect data? .updateplayer <username>');
  }
}
