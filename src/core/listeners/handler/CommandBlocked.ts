import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class CommandBlockedListener extends Listener {
  public constructor() {
    super("commandBlocked", {
      emitter: "commandHandler",
      event: "commandBlocked",
    });
  }

  public exec(message: Message, command: Command, reason: string) {
    switch (reason) {
      case "guild":
        return message.util.send(
          new LavaboatEmbed(message)
            .setDescription(`You need to be in a guild for this command`)
            .setFooter("")
        );
        break;
      case "owner":
        return message.util.send(
          new LavaboatEmbed(message)
            .setDescription(`Only my owners can use that command.`)
            .setFooter("")
        );
        break;
      case "nondjrole":
        return message.util.send(
          new LavaboatEmbed(message)
            .setDescription(
              `You are not a DJ, therefore you cannot use this command.`
            )
            .setFooter("")
        );
        break;
    }
  }
}
