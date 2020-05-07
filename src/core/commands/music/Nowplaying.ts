import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { decode } from "@lavalink/encoding";
import { LavaboatEmbed } from "../../../library/classes";

export default class NowplayingCommand extends Command {
  public constructor() {
    super("nowplaying", {
      aliases: ["nowplaying", "np", "currentlyplaying"],
      description: {
        content: "Shows the currently playing song",
      },
      channel: "guild",
    });
  }

  public async exec(message: Message) {
    const player = this.client.music.players.get(message.guild.id);
    if (!player)
      return message.util.send(
        new LavaboatEmbed(message).setDescription(`There is nothing playing`)
      );

    const length = decode(player.queue.queue[0].track).length;

    return message.util.send(
      new LavaboatEmbed(message)
        .setThumbnail(
          `https://i.ytimg.com/vi/${
            decode(player.queue.queue[0].track).identifier
          }/hqdefault.jpg`
        )
        .setDescription(
          `${
            "▬".repeat(
              Math.floor((player.state.position / Number(length)) * 10)
            ) +
            "🔘" +
            "▬".repeat(
              10 - Math.floor((player.state.position / Number(length)) * 10)
            )
          } [\`${this.formatTime(player.state.position)}\`]
                    
                    [${decode(player.queue.queue[0].track).title}](${
            decode(player.queue.queue[0].track).uri
          })`
        )
        .setFooter(`Requested By: ${player.queue.queue[0].requester.tag}`)
    );
  }

  private formatTime(duration: number) {
    const hours = Math.floor((duration / (1e3 * 60 * 60)) % 60),
      minutes = Math.floor(duration / 6e4),
      seconds = ((duration % 6e4) / 1e3).toFixed(0);

    //@ts-ignore
    return `${
      hours ? `${hours.toString().padStart(2, "0")}:` : ""
    }${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}
