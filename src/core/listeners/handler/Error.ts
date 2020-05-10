import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class HandlerErrorListener extends Listener {
  public constructor() {
    super("error_handler", {
      emitter: "commandHandler",
      event: "error",
    });
  }

  public async exec(error: Error, message: Message, command: Command) {
    return message.util.send(
      new LavaboatEmbed(message)
        .setDescription(
          `Whoopies, we got an error!
          
          Please report this error to: ${this.formatOwners(
            config.get("bot.owners")
          )}\n\`\`\`js\n${error}\`\`\``
        )
        .setFooter("")
    );
  }

  public formatOwners(arr: string[]) {
    return arr.length > 1
      ? `${arr
          .slice(0, -1)
          .map((owner) => `${this.client.users.cache.get(owner).tag}`)
          .join(", ")} or ${this.client.users.cache.get(arr.slice(-1)[0]).tag}`
      : this.client.users.cache.get(arr[0]).tag;
  }
}
