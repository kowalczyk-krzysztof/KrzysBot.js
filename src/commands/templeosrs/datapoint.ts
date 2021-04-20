// // Discord
// import { Message } from 'discord.js';
// // Dotenv
// import dotenv from 'dotenv';
// // Axios
// import axios, { AxiosResponse } from 'axios';
// // Cooldown cache
// import { isOnCooldown, cache, isInCache } from '../../cache/cooldown';
// // UTILS: Embeds
// import { Embed } from '../../utils/embed';
// // UTILS: Runescape name validator
// import {
//   runescapeNameValidator,
//   invalidUsername,
// } from '../../utils/osrs/runescapeNameValidator';
// // UTILS: Error handler
// import { errorHandler } from '../../utils/errorHandler';
// import { CommandCooldowns } from '../../utils/osrs/enums';
// // Anti-spam
// import { antiSpam } from '../../cache/antiSpam';

// dotenv.config({ path: 'config.env' });

// let lastFetchedCache: { [key: string]: number } = {};
// let usernameCache: { [key: string]: any } = {};

// const TEMPLE_INFO: string = process.env.TEMPLE_INFO as string;
// const TEMPLE_DATA_POINT: string = process.env.TEMPLE_DATA_POINT as string;
// /**
// user1 does .datapoint floopily, first it queries spammable endpoint to check if there is cooldown (set by temple) on updating - if not it then tries to add a datapoint, if succeeded it adds the username floopily to list of recently updated and sets a timer to remove it in 30 min and adds a 30 min cooldown on datapoint command for user1 so user1 can't update any other user

// then user2 does .datapoint floopily - they will get a msg that floopily has been updated already and nothing will happen

// now user2 tries to .datapoint 1cookiee but someone has updated 1cookiee on temple site

// an entry will get created in cache with that username + cooldown from temple and as long as this entry exists a msg will show saying 1cookiee has alrdy been updated on temple and to try again in <cooldown shown by temple> (less than 60 sec)
// user2 waits 60 sec and tries to add 1cookiee - it succeeds and add 1cookiee to checked usernames and adds cooldown for user2
//  */
// export const datapoint = async (
//   msg: Message,
//   commandName: string,
//   ...args: string[]
// ): Promise<Message | undefined | void> => {
//   if (antiSpam(msg, commandName) === true) return;
//   const embed: Embed = new Embed();
//   const nameCheck: string | undefined = runescapeNameValidator(args);
//   if (nameCheck === undefined) return msg.channel.send(invalidUsername);
//   const username: string = nameCheck;
//   const cacheItem: string = commandName + username.toLowerCase();
//   if (username in usernameCache) {
//     const timeWhenAddedToCache: number = usernameCache[username];
//     const now: number = Date.now();
//     const timeLeftSecondsDecimal: number =
//       CommandCooldowns.DATAPOINTS - (now - timeWhenAddedToCache) / 1000;
//     const timeLeftSeconds: number = parseInt(timeLeftSecondsDecimal.toString());
//     const timeLeftMinDecimal: number = timeLeftSeconds / 60;
//     const timeLeftMin: number = parseInt(timeLeftMinDecimal.toString());
//     let time: number;
//     let secondOrMin: string;
//     if (timeLeftSecondsDecimal > 60) {
//       time = timeLeftMin;
//       secondOrMin = ' min';
//     } else if (timeLeftSecondsDecimal >= 1) {
//       time = timeLeftSeconds;
//       secondOrMin = 's';
//     } else {
//       time = 1;
//       secondOrMin = 's';
//     }
//     const cooldownMsg: string = `Datapoints for **${username}** have already been updated in the last 30 min. Please wait **${time}${secondOrMin}** and try again`;

//     return msg.channel.send(new Embed().setDescription(cooldownMsg));
//   }

//   if (cacheItem in cache)
//     return isInCache(msg, cacheItem, CommandCooldowns.DATAPOINTS, true);

//   if (username in lastFetchedCache) {
//     const timeWhenAddedToCache: number = lastFetchedCache[username];
//     const now: number = Date.now();
//     const timeLeftSecondsDecimal: number = (timeWhenAddedToCache - now) / 1000;
//     const timeLeftSeconds: number = parseInt(timeLeftSecondsDecimal.toString());
//     return msg.channel.send(
//       embed.setDescription(
//         `Player **${username}** has already been updated recently, if you still want to add a new datapoint, please wait **${timeLeftSeconds}s** and try again`
//       )
//     );
//   } else {
//     let cooldown: number;
//     try {
//       const res: AxiosResponse = await axios.get(`${TEMPLE_INFO}${username}`);
//       if (res.data.error) {
//         if (res.data.error.Code === 402 || res.data.error.Code === 401) {
//           if (
//             isOnCooldown(
//               msg,
//               commandName,
//               CommandCooldowns.DATAPOINTS,
//               false
//             ) === true
//           )
//             return;
//           embed.addField(
//             'ERROR',
//             `Player **${username}** was not found on hiscores`
//           );
//           msg.channel.send(embed);
//         } else msg.channel.send(errorHandler(res.data.error));
//       } else if (res.data.data['Datapoint Cooldown'] !== '-') {
//         cooldown = res.data.data['Datapoint Cooldown'];
//         const secToMs: number = cooldown * 1000;
//         lastFetchedCache[username] = Date.now() + secToMs;
//         setTimeout(() => {
//           delete lastFetchedCache[username];
//         }, secToMs);
//         embed.setDescription(
//           `Player **${username}** has already been updated recently, if you still want to add a new datapoint, please wait **${cooldown}s** and try again`
//         );
//         return msg.channel.send(embed);
//       } else {
//         if (
//           isOnCooldown(msg, commandName, CommandCooldowns.DATAPOINTS, false) ===
//           true
//         )
//           return;
//         try {
//           const res: AxiosResponse = await axios.get(
//             `${TEMPLE_DATA_POINT}${username}`
//           );
//           if (res.status === 200) {
//             usernameCache[username] = Date.now();
//             setTimeout(() => {
//               delete usernameCache[username];
//             }, CommandCooldowns.DATAPOINTS * 1000);
//             embed.setDescription(
//               `Updated datapoints for player: \`\`\`${username}\`\`\``
//             );
//             return msg.channel.send(embed);
//           } else {
//             return msg.channel.send(errorHandler());
//           }
//         } catch (err) {
//           return msg.channel.send(errorHandler(err));
//         }
//       }
//     } catch (err) {
//       return msg.channel.send(errorHandler(err));
//     }
//   }
// };
