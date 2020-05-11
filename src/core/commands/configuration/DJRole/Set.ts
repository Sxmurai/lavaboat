import { Command } from "discord-akairo";
import { Message, Role } from "discord.js";
import { LavaboatEmbed } from "../../../../library/classes";

export default class DJRoleCommand extends Command {
  public constructor() {
    super("djrole-set", {
      args: [
        {
          id: "role",
          type: "role",
          prompt: {
            start: "Please provide a new djrole",
            retry: "I need a valid role",
          },
        },
      ],
      category: "flag",
    });
  }

  public exec(message: Message, { role }: { role: Role }) {
    const currentDJRole = this.client.db.get(
      message.guild.id,
      "config.djRole",
      null
    );

    if (currentDJRole === role.id)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(
            `Please change the DJ Role to something it isn't already`
          )
          .setFooter("")
      );

    this.client.db.set(message.guild.id, "config.djRole", role.id);

    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(
          `Changed the prefix from: ${
            currentDJRole ? `<@&${currentDJRole}>` : "Nothing"
          } to ${role.toString()}`
        )
        .setFooter("")
    );
  }
}
