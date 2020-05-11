import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";
import { Queue } from "../../../library/interfaces/Queue";

export default class ShuffleCommand extends Command {
  public constructor() {
    super("shuffle", {
      aliases: ["shuffle", "mixup"],
      description: {
        content: "Shuffles the queue",
      },
      channel: "guild",
      userPermissions: (msg: Message) => {
        if (msg.member.hasPermission("ADMINISTRATOR")) return null;
        const djRole = this.client.db.get(msg.guild.id, "config.djRole", null);

        if (djRole && !msg.member.roles.cache.has(djRole)) return "DJ";
      },
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

    player.queue.queue = this.shuffle(player.queue.queue as any[]);

    return message.util.send(
      new LavaboatEmbed(message).setDescription(`🔀 Shuffled the queue`)
    );
  }

  private shuffle(array: Array<string>): any[] {
    const currentTrack = array[0];
    array.shift();

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    array.unshift(currentTrack);

    return array;
  }
}
