// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// Axios
import axios, { AxiosResponse } from 'axios';
// Cooldown cache
import { isOnCooldown } from '../../cache/cooldown';
// UTILS: Embeds
import {
  EmbedTitles,
  ErrorEmbed,
  TempleEmbedNoFooter,
  usernameString,
} from '../../utils/embed';
// UTILS: Enums
import {
  CommandCooldowns,
  OsrsRandom,
  SkillAliases,
  Skills,
  TempleGameMode,
  TempleGameModeFormatted,
  TempleOther,
} from '../../utils/osrs/enums';
// UTILS: Prefix validator
import {
  invalidPrefixMsg,
  isPrefixValid,
  PrefixCategories,
} from '../../utils/osrs/isPrefixValid';
// UTILS: Input validator
import { skillList } from '../../utils/osrs/inputValidator';
// UTILS: Error handler
import { errorHandler } from '../../utils/errorHandler';
// Anti-spam
import { antiSpam } from '../../cache/antiSpam';
// UTILS: Temple index to key
import { aliasToSkillIndex, indexToSkill } from '../../utils/osrs/templeIndex';

dotenv.config({ path: 'config.env' });

const RECENT_200M: string = process.env.TEMPLE_RECENT200M as string;

export const recent200m = async (
  msg: Message,
  commandName: string,
  ...args: string[]
): Promise<Message | ErrorEmbed | undefined> => {
  if (antiSpam(msg, commandName) === true) return;
  const cooldown: number = CommandCooldowns.RECENT200M;
  const skill: string | undefined = isPrefixValid(
    msg,
    args,
    skillList,
    PrefixCategories.SKILL200M
  );
  if (!skill) return;
  const lowerCasedArguments: string = args[0].toLowerCase();
  if (
    isOnCooldown(msg, commandName, cooldown, false, lowerCasedArguments) ===
    true
  )
    return;
  else if (
    skill === SkillAliases.TOTAL_ALIAS1 ||
    skill === SkillAliases.TOTAL_ALIAS2
  ) {
    return msg.channel.send(
      invalidPrefixMsg(skillList, PrefixCategories.SKILL200M)
    );
  }
  const skillNr: number | undefined = aliasToSkillIndex(skill);
  try {
    const res: AxiosResponse = await axios.get(`${RECENT_200M}${skillNr}`);
    if (res.status === 200) {
      const result: TempleEmbedNoFooter = generateResult(res.data.data);

      return msg.channel.send(result);
    } else return;
  } catch (err) {
    return errorHandler(err);
  }
};
// Generates embed sent to user
const generateResult = (
  listOfPlayers: any
): TempleEmbedNoFooter | ErrorEmbed => {
  if (!listOfPlayers) return errorHandler();
  else {
    const whatSkill: string | undefined = indexToSkill(
      listOfPlayers[0].Skill
    ) as string;
    let skillFormatted: string;
    if (whatSkill === Skills.RC)
      skillFormatted = OsrsRandom.RUNECRAFTING.toUpperCase();
    else skillFormatted = whatSkill.toUpperCase() as string;

    const embed: TempleEmbedNoFooter = new TempleEmbedNoFooter().setTitle(
      `${EmbedTitles.RECENT_200M} ${skillFormatted}`
    );
    embed.addField(
      `${usernameString}`,
      `\`\`\`${listOfPlayers[0].Username}\`\`\``
    );
    const gamemode: number = listOfPlayers[0]['Game Mode'];

    let gameModeString;
    if (gamemode === TempleGameMode.IM)
      gameModeString = TempleGameModeFormatted.IM;
    else if (gamemode === TempleGameMode.UIM)
      gameModeString = TempleGameModeFormatted.UIM;
    else if (gamemode === TempleGameMode.HCIM)
      gameModeString = TempleGameModeFormatted.HCIM;
    else gameModeString = 'NORMAL';
    embed.addField(`ACCOUNT TYPE:`, `\`\`\`${gameModeString}\`\`\``);
    embed.addField(
      `${TempleOther.RANK.toUpperCase()}:`,
      `\`\`\`${listOfPlayers[0].Rank}\`\`\``
    );

    if (listOfPlayers[0][TempleOther.COUNTRY] === null)
      embed.addField(`${TempleOther.COUNTRY}`, `\`\`\`NO INFO\`\`\``);
    else
      embed.addField(
        `${TempleOther.COUNTRY}`,
        `\`\`\`${listOfPlayers[0][TempleOther.COUNTRY]}\`\`\``
      );
    return embed;
  }
};
