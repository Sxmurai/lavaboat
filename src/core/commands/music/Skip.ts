import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class SkipCommand extends Command {
  public constructor() {
    super("skip", {
      aliases: ["skip", "skiptrack"],
      description: {
        content: "Skips the track",
      },
      channel: "guild",
    });
  }

  public async exec(message: Message) {
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

    if (message.guild.me.voice.channel.id !== channel.id)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`Please join a voice channel that I am in.`)
      );

    await player.stop();
    player.queue.queue.shift();
    await player.queue.start(message);

    return message.util.send(
      new LavaboatEmbed(message)
        .setColor("#3bdb83")
        .setDescription(`Skipped the track successfully`)
    );
  }
}
