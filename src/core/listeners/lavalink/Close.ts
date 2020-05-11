import { Listener } from "discord-akairo";

export default class LavalinkCloseListener extends Listener {
  public constructor() {
    super("close", {
      emitter: "lavaclient",
      event: "close",
    });
  }

  public exec(node: string, reason: string, code: number) {
    this.client.logger.info(
      `(Code: ${code}) Closed connection on node: ${node} with reason: ${reason}`
    );
  }
}
// node: string, reason: string, code: number
