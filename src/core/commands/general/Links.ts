import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class LinksCommand extends Command {
  public constructor() {
    super("links", {
      aliases: ["links", "usefullinks"],
      description: {
        content: "Shows the links related around the bot",
      },
    });
  }

  public exec(message: Message) {
    return message.util.send(
      new LavaboatEmbed(message)
        .setAuthor(
          `Useful Links | ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          [
            `[Github](https://github.com/Sxmurai/lavaboat)`,
            `[Support Server](https://discord.gg/c9zYnWx)`,
            `[Invite](https://discordapp.com/oauth2/authorize?client_id=707403122997198959&scope=bot&permissions=0)`,
          ].join("\n")
        )
    );
  }
}
