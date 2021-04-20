// // Discord
// import { Message } from 'discord.js';
// // FS
// import fs from 'fs';
// // PATH
// import path from 'path';
// // UTILS: Embeds
// import { Embed } from '../utils/embed';
// // UTILS: Error handler
// import { errorHandler } from '../utils/errorHandler';
// // Command list directory
// const dir: string = path.join(__dirname, '../../data/commandlist.json');
// interface Command {
//   name: string;
//   description: string;
//   example: string;
//   category: string;
//   aliases: string[];
// }
// interface CommandList {
//   [key: string]: {
//     [key: string]: Command;
//   };
// }
// // Creating command list
// export const createCommandList = (msg: Message, args: string[]) => {
//   const embed: Embed = new Embed();
//   const content: string[] = args;
//   // If command was used without arguments (".commands") then check if it's on cooldown, if not the send send user list of cateogires
//   if (content.length === 0) {
//     fs.readFile(dir, (err, data: Buffer) => {
//       if (err) return msg.channel.send(errorHandler(err));
//       const json: CommandList = JSON.parse(data.toString());
//       const PrefixCategories: string[] = [];
//       // Here I'm mapping each category and getting the first object in it, then getting its category property. I'm doing it like this so I can have easily indexable lowercase category names as keys and still be able to return category names nicely formatted to user.
//       Object.values(json).map((command: { [key: string]: Command }) => {
//         PrefixCategories.push(Object.values(command)[0].category);
//       });
//       return msg.channel.send(
//         embed
//           .setFooter(
//             `To get a list of commands in a category use\n.commands category`
//           )
//           .addField(
//             'Command PrefixCategories',
//             `\n${PrefixCategories.join('\n')}`
//           )
//       );
//     });
//   } else {
//     // If user provided arguments e.g ".commands foo bar" then join them into lowercase string and check if category with such name exists (keyword in json). If not return a msg to user. If category exists then check if it's on cooldown, if not return list of commands in that category. If a category has aliases, include them, if not then don't include aliases
//     fs.readFile(dir, (err, data: Buffer) => {
//       if (err) return msg.channel.send(errorHandler(err));
//       const keyword: string = content.join('').toLowerCase();
//       const json: CommandList = JSON.parse(data.toString());
//       if (keyword in json === true) {
//         embed.setTitle('Commands');
//         Object.values(json[keyword]).forEach((command: Command) => {
//           if (command.aliases.length > 0) {
//             const formattedAliases: string = command.aliases.join(' ');
//             embed.addField(
//               `${command.name}`,
//               `**Description**: ${command.description}\n**Category**: ${command.category}\n**Aliases**:\`\`\`${formattedAliases}\`\`\`**Example**:\`\`\`${command.example}\`\`\``
//             );
//           } else
//             embed.addField(
//               `${command.name}`,
//               `\n**Description**: ${command.description}\n**Category**: ${command.category}\n**Example**:\`\`\`${command.example}\`\`\``
//             );
//         });
//         return msg.channel.send(embed);
//       } else {
//         // Formatting content (string[]) so user sees "foo bar" instead of "foo,bar"
//         const userInput: string = content.join(' ');
//         return msg.channel.send(
//           embed.setDescription(`Category **${userInput}** does not exist`)
//         );
//       }
//     });
//   }
// };
