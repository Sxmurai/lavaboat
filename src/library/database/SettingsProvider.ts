import { Provider } from "discord-akairo";
import {
  guildSettings,
  defaultGuildSettings,
} from "../interfaces/SettingsProvider";
import { Guild } from "discord.js";
import { guild } from "@prisma/client";
import _ from "dot-prop";

export class SettingsProvider extends Provider {
  public async init(): Promise<void> {
    for (const guild of await prisma.guild.findMany())
      this.items.set(guild.id, JSON.parse(guild.data));
  }

  public get<T>(guild: string | Guild, setting: string, defaultValue?: T): T {
    let entry =
      this.items.get(SettingsProvider.getGuildID(guild)) ??
      defaultGuildSettings;
    return _.get<T>(entry, setting) ?? defaultValue;
  }

  public getRaw(guild: string | Guild): guildSettings {
    return this.items.get(SettingsProvider.getGuildID(guild));
  }

  public async set(
    guild: string | Guild,
    setting: string,
    value: any
  ): Promise<guild> {
    let item =
      this.items.get(SettingsProvider.getGuildID(guild)) ??
      (await this.ensureTable(SettingsProvider.getGuildID(guild)));
    _.set(item, setting, value);
    this.items.set(SettingsProvider.getGuildID(guild), item);

    return await prisma.guild.update({
      where: {
        id: SettingsProvider.getGuildID(guild),
      },
      data: {
        data: JSON.stringify(item),
      },
    });
  }

  public async delete(guild: string | Guild, setting: string) {
    const item =
      this.items.get(SettingsProvider.getGuildID(guild)) ??
      (await this.ensureTable(SettingsProvider.getGuildID(guild)));
    _.delete(item, setting);
    this.items.set(SettingsProvider.getGuildID(guild), item);

    return await prisma.guild.update({
      where: {
        id: SettingsProvider.getGuildID(guild),
      },
      data: {
        data: JSON.stringify(item),
      },
    });
  }

  public async clear(guild: string | Guild): Promise<guild> {
    this.items.delete(SettingsProvider.getGuildID(guild));
    return await prisma.guild.delete({
      where: {
        id: SettingsProvider.getGuildID(guild),
      },
    });
  }

  public async ensureTable(guild: string | Guild): Promise<guildSettings> {
    let item = this.items.get(SettingsProvider.getGuildID(guild));
    if (!item) {
      await prisma.guild.create({
        data: {
          id: SettingsProvider.getGuildID(guild),
          data: JSON.stringify(defaultGuildSettings),
        },
      });
      item = defaultGuildSettings;
    }

    return item;
  }

  public static getGuildID(guild: string | Guild): string {
    if (guild instanceof Guild) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
}
