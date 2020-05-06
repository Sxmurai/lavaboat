import { Listener } from "discord-akairo";

export default class VoiceStateUpdateListener extends Listener {
  public constructor() {
    super("VOICE_STATE_UPDATE", {
      emitter: "ws",
      event: "VOICE_STATE_UPDATE",
    });
  }

  public exec(payload) {
    this.client.music.stateUpdate(payload);
  }
}
