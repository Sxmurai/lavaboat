import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../../library/classes";

export default class AnnounceCommand extends Command {
  public constructor() {
    super("announce-on", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    const setting = this.client.db.get(message.guild.id, "config.announceNext", true)

    this.client.db.set(message.guild.id, "config.announceNext", !setting);

    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(
          `Announce next is now set to: ${this.client.db.get(message.guild.id, "config.announceNext", true)}`
        )
        .setFooter("")
    );
  }
}
