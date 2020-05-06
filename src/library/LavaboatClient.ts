import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { LavaboatOptions } from "./interfaces/Client";
import { Configuration, LavaboatManager, LavaboatEmbed } from "./classes";
import Logger from "@ayanaware/logger";
import { join } from "path";

declare global {
  const config: Configuration;
}

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    data: LavaboatOptions;
    music: LavaboatManager;
    logger: Logger;
  }
}

export default class LavaboatClient extends AkairoClient {
  public constructor(public data: LavaboatOptions) {
    super({
      ownerID: config.get("bot.owners"),
      disableMentions: "everyone",
    });
  }

  public music: LavaboatManager = new LavaboatManager(config.get("nodes"), {
    shards: this.shard ? this.shard.count : 0,
    send: (id, payload) => {
      const guild = this.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);

      return;
    },
  });

  public logger: Logger = Logger.get(LavaboatManager);

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join("build", "core", "commands"),
    prefix: config.get("bot.prefix"),
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

    //await this.music.init(config.get("bot.userID"));
  }

  public async start(): Promise<string> {
    await this.setup();

    return super.login(config.get("bot.token"));
  }
}
