import { Manager, ManagerOptions } from "lavaclient";
import { LoadTrackResponse } from "@kyflx-dev/lavalink-types";
import fetch, { Response } from "node-fetch";

type identifiers = "ytsearch" | "scsearch";

export default class LavaboatManager extends Manager {
  public constructor(public nodes: any[], public options: ManagerOptions) {
    super(nodes, options);
  }

  public async load(
    track: string,
    type: identifiers
  ): Promise<LoadTrackResponse[]> {
    const { address, port, password } = this.nodes[0];

    const res: Response = await fetch(
      `http://${address}:${port}/loadTracks?identifier=${type}:${track}`,
      {
        headers: {
          Authorization: password,
        },
      }
    );

    return (await res.json()) ?? ({} as LoadTrackResponse[]);
  }

  public async decode(track: string) {
    const { address, port, password } = this.nodes[0];

    const res: Response = await fetch(
      `http://${address}:${port}/decodetracks?tracl=${track}`,
      {
        headers: {
          Authorization: password,
        },
      }
    );

    return (await res.json()) ?? {};
  }
}
