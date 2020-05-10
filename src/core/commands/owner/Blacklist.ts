import { Command, Flag } from "discord-akairo";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("blacklist", {
      aliases: ["blacklist"],
      description: {
        content: "Blacklists a user from the bot for being bad",
        usage:
          "blacklist [add, adduser|remove, rm, delete, del|list, ls, all] <[args]>",
        examples: [
          "blacklist add @nick... being mean to my bot",
          "blacklist add Samurai",
          "blacklist remove @Samurai",
          "blacklist list",
          "blacklist list 2",
        ],
      },
      ownerOnly: true,
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["blacklist-add", "add", "adduser"],
        ["blacklist-remove", "remove", "rm", "delete", "del"],
        ["blacklist-list", "list", "ls", "all"],
      ],
      default: "blacklist-list",
    };

    return Flag.continue(method);
  }
}
