import { Listener } from "discord-akairo";

export default class LavalinkDisconnectListener extends Listener {
  public constructor() {
    super("disconnect", {
      emitter: "lavaclient",
      event: "disconnect",
    });
  }

  public exec(node: string, reason: string) {
    this.client.logger.info(
      `Connection disconnected on node: ${node}. Reason: ${reason}`
    );
  }
}
