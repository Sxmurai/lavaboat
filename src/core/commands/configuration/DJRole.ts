import { Command, Flag } from "discord-akairo";

export default class DJRoleCommand extends Command {
  public constructor() {
    super("djrole", {
      aliases: ["djrole", "dj"],
      description: {
        content:
          "The DJ role allows users to have control over the music without random people runing the listening party!.",
        usage: "djrole [set|delete, remove, rm, restore|view] <[args]>",
        examples: ["djrole set @DJ", "djsrole restore"],
      },
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["djrole-set", "set"],
        ["djrole-delete", "delete", "remove", "rm", "restore"],
        ["djrole-view", "view"],
      ],
      default: "djrole-view",
    };

    return Flag.continue(method);
  }
}
