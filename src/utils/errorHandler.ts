import { Message } from 'discord.js';
// TODO: Make this good
export const errorHandler = (err: any, msg: Message): Promise<Message> => {
  console.log(err);
  return msg.channel.send('**Error**');
};
