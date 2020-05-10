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

    let statuses = [
        `${config.get("bot.prefix")}help`,
        `${config.get("bot.prefix")}help | ${Intl.NumberFormat().format(
          this.client.users.cache.size
        )} members!`,
        `${config.get("bot.prefix")}help | ${Intl.NumberFormat().format(
          this.client.guilds.cache.size
        )} guilds!`,
        `${config.get("bot.prefix")}help | ${
          this.handler.modules.size
        } commmands!`,
      ],
      i = 0;

    setInterval(() => {
      this.client.user.setActivity(statuses[i++ % statuses.length], {
        type: "LISTENING",
      });
    }, 25e3);
  }
}
