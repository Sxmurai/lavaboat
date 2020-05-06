import { Listener } from "discord-akairo";

export default class LavalinkOpenListener extends Listener {
  public constructor() {
    super("open", {
      emitter: "lavaclient",
      event: "open",
    });
  }

  public exec(node: string) {
    this.client.logger.info(`Opened connection on node: ${node}`);
  }
}
