import { Listener } from "discord-akairo";

export default class LavalinkErrorListener extends Listener {
  public constructor() {
    super("error", {
      emitter: "lavaclient",
      event: "error",
    });
  }

  public exec(error: any, node: string) {
    this.client.logger.info(`Errored on node: ${node}. Error: ${error}`);
  }
}
