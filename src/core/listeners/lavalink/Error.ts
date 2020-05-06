import { Listener } from "discord-akairo";

export default class LavalinkOpenListener extends Listener {
  public constructor() {
    super("open", {
      emitter: "lavaclient",
      event: "open",
    });
  }

  public exec(error: any, node: string) {
    this.client.logger.info(`Errored on node: ${node}. Error: ${error}`);
  }
}
