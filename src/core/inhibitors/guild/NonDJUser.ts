import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class NonDJUserInhibitor extends Inhibitor {
  public constructor() {
    super("nondjuser", {
      reason: "nondjuser",
    });
  }

  public exec(message: Message, command: Command): boolean {
    const djRole = this.client.db.get(message.guild.id, "config.djRole", null);
    if (!djRole) return false;

    if (["play", "queue", "nowplaying"].includes(command.id)) return false;

    return (
      !message.member.roles.cache.has(djRole) && command.category.id === "music"
    );
  }
}
