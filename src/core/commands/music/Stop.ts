import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class StopCommand extends Command {
  public constructor() {
    super("stop", {
      aliases: ["stop", "disconnect", "stopqueue"],
      description: {
        content: "Clears the queue, and disconnects the player.",
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

    if (message.guild.me.voice.channelID !== channel.id)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`Please join a voice channel that I am in.`)
      );

    await player.queue.clean();

    return message.util.send(
      new LavaboatEmbed(message).setDescription(`Disconnected the player.`)
    );
  }
}
