import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";
import ms from "ms";

export default class CooldownListener extends Listener {
  public constructor() {
    super("cooldown", {
      emitter: "commandHandler",
      event: "cooldown",
    });
  }

  public exec(message: Message, command: Command, remaining: number) {
    return message.util.send(
      new LavaboatEmbed(message).setDescription(
        `Woah there, slow down!\n\nPlease wait: \`${ms(remaining, {
          long: true,
        })}\` before using this command again`
      )
    );
  }
}
