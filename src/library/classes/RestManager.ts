import { TrackInfo, LoadTrackResponse } from "@kyflx-dev/lavalink-types";
import fetch from "node-fetch";

export class RestManager {
  public static async decodeTrack(track: string): Promise<TrackInfo> {
    const { address, port, password } = config.get("nodes")[0];

    const res = await fetch(
      `http://${address}:${port}/decodetrack?track=${track}`,
      {
        headers: {
          Authorization: password,
        },
      }
    );

    return (await res.json()) || {};
  }

  public static async loadTracks(track: string): Promise<LoadTrackResponse> {
    const { address, port, password } = config.get("nodes")[0];

    const res = await fetch(
      `http://${address}:${port}/loadtracks?identifier=${track}`,
      {
        headers: {
          Authorization: password,
        },
      }
    );

    return (await res.json()) || ({} as LoadTrackResponse);
  }
}
