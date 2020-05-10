import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../../library/classes";

export default class DJRoleCommand extends Command {
  public constructor() {
    super("djrole-delete", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    this.client.db.set(message.guild.id, "config.djRole", null);

    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(`Restored the default prefix`)
        .setFooter("")
    );
  }
}
