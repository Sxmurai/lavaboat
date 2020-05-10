import { Command, Argument } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../../library/classes";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix-set", {
      args: [
        {
          id: "prefix",
          type: Argument.range("string", 1, 4),
          prompt: {
            start: "Please provide a new prefix",
            retry:
              "Please enter a prefix that is in between the charactars of: `1-3`",
          },
        },
      ],
      category: "flag",
    });
  }

  public exec(message: Message, { prefix }: { prefix: string }) {
    const currentPrefix = this.client.db.get(
      message.guild.id,
      "config.prefix",
      config.get("prefix")
    );
    if (currentPrefix === prefix)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(
            `Please change the prefix to something it isn't already`
          )
          .setFooter("")
      );

    this.client.db.set(message.guild.id, "config.prefix", prefix);

    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(
          `Changed the prefix from: \`${currentPrefix}\` to \`${prefix}\``
        )
        .setFooter("")
    );
  }
}
