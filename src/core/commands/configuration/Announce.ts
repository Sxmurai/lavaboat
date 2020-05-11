import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class AnnounceCommand extends Command {
  public constructor() {
    super("announce", {
      aliases: ["announce", "announcetrack"],
      description: {
        content: "Configures to show when the next track is playing",
        usage: "announce [on|off]",
        examples: ["announce on", "announce off"],
      },
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["announce-on", "on"],
        ["announce-off", "off"],
      ],

      otherwise: (msg: Message) => {
        //@ts-ignore
        const prefix = this.handler.prefix(msg);

        return new LavaboatEmbed(msg)
          .setDescription(
            `The current setting for announcing the next track is set to \`${this.client.db.get(msg.guild.id, "config.announceNext", true)}\`\n\nNot what you were looking for? Run the: \`${prefix}help prefix\` command for the usage`
          )
          .setFooter("");
      },
    };

    return Flag.continue(method);
  }
}
