import { Command } from "discord-akairo";
import { Message, User } from "discord.js";

import { LavaboatEmbed } from "../../../../library/classes";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("blacklist-remove", {
      args: [
        {
          id: "user",
          type: async (_, str: string): Promise<User> => {
            if (!str) return null;

            const toFind =
              (await this.client.users.fetch(str).catch(() => null)) ||
              _.mentions.users.first();

            return toFind || null;
          },
          prompt: {
            start: "Please provide a user to unblacklist",
            retry: "Are you fockin thickk? Supply a valid user you donkey",
          },
        },
      ],
      category: "flag",
    });
  }

  public exec(message: Message, { user }: { user: User }) {
    const currentBlacklist: any[] = this.client.db.get(
      "global",
      "blacklist.users",
      []
    );

    if (!currentBlacklist.some((data) => data.id.includes(user.id)))
      return message.util.send(
        new LavaboatEmbed(message).setDescription(
          `\`${user.tag}\` isn't already blacklisted!`
        )
      );

    currentBlacklist.splice(
      currentBlacklist.findIndex((data) => data.id === user.id),
      1
    );

    this.client.db.set("global", "blacklist.users", currentBlacklist);

    return message.util.send(
      new LavaboatEmbed(message).setDescription(
        `Sucessfully unblacklisted: \`${user.tag}\``
      )
    );
  }
}
