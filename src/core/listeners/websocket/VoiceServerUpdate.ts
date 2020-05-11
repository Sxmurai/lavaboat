import { Listener } from "discord-akairo";

export default class VoiceServerUpdateListener extends Listener {
  public constructor() {
    super("VOICE_SERVER_UPDATE", {
      emitter: "ws",
      event: "VOICE_SERVER_UPDATE",
    });
  }

  public exec(payload) {
    this.client.music.serverUpdate(payload);
  }
}
