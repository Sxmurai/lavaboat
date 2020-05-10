import { Configuration } from "./library/classes";
import { PrismaClient } from "@prisma/client";

(global as any).config = Configuration.getInstance();
(global as any).prisma = new PrismaClient();

import LavaboatClient from "./library/LavaboatClient";

const client = new LavaboatClient({
  token: config.get("bot.token"),
  prefix: config.get("bot.prefix"),
  owners: config.get("bot.owners"),
});

(async () => {
  await prisma
    .connect()
    .catch((error: Error): void => client.logger.error(error));

  await client
    .start()
    .catch((error: Error): void => client.logger.error(error));
})();
