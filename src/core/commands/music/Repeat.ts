import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class RepeatCommand extends Command {
  public constructor() {
    super("repeat", {
      aliases: ["repeat", "loop", "repeattrack"],
      args: [
        {
          id: "type",
          type: ["queue", "track"],
          default: "track",
        },
      ],
      description: {
        content: "Sets the current track/queue on a repeat",
        usage: "repeat {queue, track}",
        examples: ["repeat queue", "repeat track"],
      },
      channel: "guild",
    });
  }

  public async exec(message: Message, { type }: { type: "queue" | "track" }) {
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

    player.queue.repeat[type] = !player.queue.repeat[type];
    const opposite = type === "queue" ? "track" : "queue";
    player.queue.repeat[opposite] = player.queue.repeat[opposite] = false;

    return message.util.send(
      new LavaboatEmbed(message).setDescription(
        `${
          player.queue.repeat[type] === true ? "Started" : "Stopped"
        } repeating the ${
          type === "track" ? "currently playing track" : "current queue"
        }.`
      )
    );
  }
}
