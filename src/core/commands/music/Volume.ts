import { Command, Argument } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class VolumeCommand extends Command {
  public constructor() {
    super("volume", {
      aliases: ["volume", "vol", "setvolume", "setvol"],
      args: [
        {
          id: "volume",
          type: Argument.range("number", 1, 101),
          prompt: {
            start: "Please provide a volume",
            retry: "The number must be 1-100",
          },
        },
      ],
      description: {
        content: "Changes the volume of the player",
        usage: "volume [1-100]",
        examples: ["volume 20", "volume 1"],
      },
      channel: "guild",
    });
  }

  public async exec(message: Message, { volume }: { volume: number }) {
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

    await player.setVolume(volume);

    return message.util.send(
      new LavaboatEmbed(message)
        .setColor("#3bdb83")
        .setDescription(`Set the volume to: \`${volume}/100\``)
    );
  }
}
