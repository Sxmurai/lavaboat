import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class BlacklistInhibitor extends Inhibitor {
  public constructor() {
    super("blacklist", {
      reason: "blacklisted",
    });
  }

  public exec(message: Message): boolean {
    return this.client.db
      .get("global", "blacklist.users", [])
      .includes(message.author.id);
  }
}
