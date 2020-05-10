import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../../library/classes";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix-delete", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    this.client.db.set(
      message.guild.id,
      "config.prefix",
      config.get("bot.prefix")
    );

    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(`Restored the default prefix`)
        .setFooter("")
    );
  }
}
