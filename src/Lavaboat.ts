import LavaboatClient from "./library/LavaboatClient";
import { Configuration } from "./library/classes";

(global as any).config = Configuration.getInstance();

const client = new LavaboatClient({
  token: config.get("bot.token"),
  prefix: config.get("bot.prefix"),
  owners: config.get("bot.owners"),
});

import "./library/classes/Formatter";

(async () => {
  await client
    .start()
    .catch((error: Error): void => client.logger.error(error));
})();
