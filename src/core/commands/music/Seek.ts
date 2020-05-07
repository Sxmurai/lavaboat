import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";
import { decode } from "@lavalink/encoding";
import ms from "ms";

export default class SeekCommand extends Command {
  public constructor() {
    super("seek", {
      aliases: ["seek", "moveto"],
      args: [
        {
          id: "time",
          type: "string",
          match: "content",
          prompt: {
            start: "Please provide a time",
          },
        },
      ],
      description: {
        content: "Seeks to a position",
      },
      channel: "guild",
    });
  }

  public async exec(message: Message, { time }: { time: string }) {
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

    if (ms(time) > decode(player.queue.queue[0].track).length)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`That isn't a valid time`)
      );

    await player.seek(ms(time));

    return message.util.send(
      new LavaboatEmbed(message)
        .setColor("#3bdb83")
        .setDescription(`Seeked to: \`${time}\``)
    );
  }
}
