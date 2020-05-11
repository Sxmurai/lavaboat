import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

const bbLevels: string[] = ["earrape", "high", "medium", "low", "none"];
const levels: object = {
  earrape: 0.25,
  high: 0.1,
  medium: 0.06,
  low: 0.03,
  none: 0,
};

export default class BassBoostCommand extends Command {
  public constructor() {
    super("bassboost", {
      aliases: ["bassboost", "bb"],
      args: [
        {
          id: "level",
          type: bbLevels,
          prompt: {
            start:
              "Please provide the setting for the amount of bass. Check the help command for the levels.",
            retry: `That is not a vaild level. The valid levels are: ${bbLevels
              .map((l) => `\`${l}\``)
              .join(", ")}.`,
          },
        },
      ],
      description: {
        content: "Changes the bassboost settings on the current player",
        usage: "bassboost { high, medium, low, none }",
        examples: ["bassboost high", "bassboost none"],
      },
      channel: "guild",
      userPermissions: (msg: Message) => {
        if (msg.member.hasPermission("ADMINISTRATOR")) return null;
        const djRole = this.client.db.get(msg.guild.id, "config.djRole", null);

        if (djRole && !msg.member.roles.cache.has(djRole)) return "DJ";
      },
    });
  }

  public async exec(message: Message, { level }: { level: string }) {
    const player = this.client.music.players.get(message.guild.id);
    if (!player)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`There is nothing playing`)
      );

    const { channel } = message.member.voice;
    if (!channel)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`Please join a voice channel`)
      );

    if (message.guild.me.voice.channelID !== channel.id)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`Please join a voice channel that I am in.`)
      );
    await player.equalizer(
      Array(6)
        .fill(null)
        .map((_, index: number) => ({ band: index++, gain: levels[level] }))
    );

    return message.util.send(
      new LavaboatEmbed(message).setDescription(
        `Successfully set bass boost to: \`${level}\``
      )
    );
  }
}
