import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix", "pfx"],
      description: {
        content: "Changes or restores the prefix.",
        usage: "prefix [set|delete, remove, rm, restore] <[args]>",
        examples: ["prefix set ??", "prefix delete"],
      },
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["prefix-set", "set"],
        ["prefix-delete", "delete", "remove", "rm", "restore"],
      ],

      otherwise: (msg: Message) => {
        //@ts-ignore
        const prefix = this.handler.prefix(msg);

        return new LavaboatEmbed(msg)
          .setDescription(
            `Hello! The prefix is: \`${prefix}\`.\n\nNot what you were looking for? Run the: \`${prefix}help prefix\` command for the usage`
          )
          .setFooter("");
      },
    };

    return Flag.continue(method);
  }
}
