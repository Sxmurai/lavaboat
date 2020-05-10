import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../../library/classes";

export default class DJRoleCommand extends Command {
  public constructor() {
    super("djrole-view", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    const djRole = message.guild.roles.cache.get(
      this.client.db.get(message.guild.id, "config.djRole", null)
    );

    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(
          `The current DJ Role is ${djRole ? djRole.toString() : "Nothing"}`
        )
        .setFooter("")
    );
  }
}
