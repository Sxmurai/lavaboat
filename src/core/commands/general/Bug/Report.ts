import { Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";

import { LavaboatEmbed } from "../../../../library/classes";

export default class BugCommand extends Command {
  public constructor() {
    super("bug-report", {
      category: "flag",
      args: [
        {
          id: "command",
          type: "commandAlias",
          prompt: {
            start: "Please provide a command to report a bug on",
            retry: "That isn't a valid command alias, please try again.",
          },
        },

        {
          id: "bug",
          type: "string",
          match: "rest",
          prompt: {
            start:
              "Please provide evidence on how to reproduce, or how it happened",
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { command, bug }: { command: Command; bug: string }
  ) {
    message.util.send(
      `Thank you for your feedback, our team will be looking at this.`
    );

    const channel = this.client.channels.cache.get("707735919196635240");
    if (!channel) return;

    (channel as TextChannel).send(
      new LavaboatEmbed(message)
        .setAuthor(
          `Bug Report - ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .addField(`Command:`, command.aliases[0])
        .addField(`Report:`, bug)
    );
  }
}
