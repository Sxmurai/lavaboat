import { Command } from "discord-akairo";
import { Message, User } from "discord.js";

import { LavaboatEmbed } from "../../../../library/classes";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("blacklist-add", {
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
            start: "Please provide a user to add",
            retry: "I need a valid user..",
          },
        },

        {
          id: "reason",
          type: "string",
          match: "rest",
          default: "No reason provided",
        },
      ],
      category: "flag",
    });
  }

  public async exec(
    message: Message,
    { user, reason }: { user: User; reason: string }
  ) {
    const currentBlacklist: any[] = this.client.db.get(
      "global",
      "blacklist.users",
      []
    );
    if (currentBlacklist.some((data) => data.id.includes(user.id)))
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#e03131")
          .setDescription(`\`${user.tag}\` is already blacklisted!`)
      );

    if (this.client.ownerID.includes(user.id))
      return message.util.send(
        new LavaboatEmbed(message).setDescription(
          `\`${user.tag}\` is an administrator of the bot! You cannot blacklist them`
        )
      );

    currentBlacklist.push({
      id: user.id,
      date: Date.now(),
      reason,
    });

    this.client.db.set("global", "blacklist.users", currentBlacklist);

    return message.util.send(
      new LavaboatEmbed(message).setDescription(
        `Sucessfully blacklisted: \`${user.tag}\``
      )
    );
  }
}
