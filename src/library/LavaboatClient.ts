import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import { LavaboatOptions } from "./interfaces/Client";
import { Configuration, LavaboatEmbed, LavaboatQueue } from "./classes";
import { SettingsProvider } from "./database/SettingsProvider";
import { PrismaClient } from "@prisma/client";
import { Logger } from "@kyflx-dev/logger";
import { join } from "path";
import { Player, Manager } from "lavaclient";

declare global {
  const config: Configuration;
  const prisma: PrismaClient;
}

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    data: LavaboatOptions; 
    music: Manager;
    logger: Logger;
    db: SettingsProvider;
  }
}

declare module "lavaclient" {
  interface Player {
    queue: LavaboatQueue;
  }
}

export default class LavaboatClient extends AkairoClient {
  public constructor(public data: LavaboatOptions) {
    super({
      ownerID: config.get("bot.owners"),
      disableMentions: "everyone",
    });
  }

  public db: SettingsProvider = new SettingsProvider();

  public music: Manager = new Manager(config.get("nodes"), {
    shards: this.shard ? this.shard.count : 1,
    send: (id, payload) => {
      const guild = this.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);

      return;
    },
    player: class LavaboatPlayer extends Player {
      queue: LavaboatQueue = new LavaboatQueue(this);
    },
  });

  public logger: Logger = Logger.custom(
    "library",
    "client",
    "src.library.LavaboatClient",
    "CLIENT"
  );

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join("build", "core", "commands"),
    prefix: (_) =>
      _.guild
        ? this.db.get(_.guild.id, "config.prefix", config.get("bot.prefix"))
        : config.get("bot.prefix"),
    allowMention: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str: string): LavaboatEmbed =>
          new LavaboatEmbed(_).setDescription(
            `${str}\n\nType: \`cancel\` to cancel the command`
          ),
        modifyRetry: (_, str: string): LavaboatEmbed =>
          new LavaboatEmbed(_).setDescription(
            `${str}\n\nType: \`cancel\` to cancel the command`
          ),
        cancel: (_) =>
          new LavaboatEmbed(_).setDescription(
            `Alright, cancelled the command for you`
          ),
        ended: (_) =>
          new LavaboatEmbed(_).setDescription(
            "Took too many tries, cancelled command."
          ),
        timeout: (_) =>
          new LavaboatEmbed(_).setDescription(
            "Prompt timeout, cancelled command"
          ),
        time: 3e4,
        retries: 3,
      },
      otherwise: "",
    },
    automateCategories: true,
    fetchMembers: true,
    blockBots: true,
    blockClient: true,
    aliasReplacement: /-/g,
    ignoreCooldown: this.ownerID,
    ignorePermissions: this.ownerID,
    defaultCooldown: 15e3,
    handleEdits: true,
    commandUtil: true,
  });

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join("build", "core", "listeners"),
  });

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: join("build", "core", "inhibitors"),
  });

  private async setup(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      lavaclient: this.music,
      ws: this.ws,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
    this.inhibitorHandler.loadAll();

    await this.music.init(config.get("bot.userID"));
    await this.db.init();
  }

  public async start(): Promise<string> {
    await this.setup();

    return super.login(config.get("bot.token"));
  }
}
