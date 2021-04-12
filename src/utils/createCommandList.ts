import { Embed } from '../utils/embed';

interface CommandListProps {
  name: string;
  description: string;
  example: string;
}
// Class representing command
export class CommandList implements CommandListProps {
  name;
  description;
  example;
  constructor(name: string, description: string, example: string) {
    this.name = name;
    this.description = description;
    this.example = example;
  }
}
// Creating command list
export const createCommandList = (...commands: CommandList[]) => {
  const embed: Embed = new Embed();
  embed.setTitle('Command list');
  commands.forEach((command: CommandList) => {
    embed.addField(
      command.name,
      `${command.description}\n\nExample: \`\`\`${command.example}\`\`\`\n`
    );
  });

  return embed;
};
