import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }

  public exec() {
    this.client.logger.info(`${this.client.user.username} is ready`);

    this.client.user.setActivity({
      type: "WATCHING",
      name: `${config.get("bot.prefix")}help`,
    });
  }
}
