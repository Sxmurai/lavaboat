import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "latency"],
      description: {
        content: "Displays the bots latency",
      },
      typing: true,
    });
  }

  public exec(message: Message) {
    const date = Date.now();

    return new Promise((resolve) => {
      (this.client["api"] as any).channels[message.channel.id].typing
        .post()
        .then(() => {
          resolve(
            message.util.send(
              new LavaboatEmbed(message)
                .setDescription(
                  [
                    `Bot: \`${this.client.ws.ping}MS\``,
                    `API: \`${Date.now() - date}MS\``,
                  ].join("\n")
                )
                .setFooter("")
            )
          );
        });
    });
  }
}
