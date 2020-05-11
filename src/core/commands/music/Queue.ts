import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";
import { decode } from "@lavalink/encoding";

export default class QueueCommand extends Command {
  public constructor() {
    super("queue", {
      aliases: ["queue", "q"],
      args: [
        {
          id: "page",
          type: "number",
          default: 1,
        },
      ],
      description: {
        content: "Displays the current queue",
      },
      channel: "guild",
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const player = this.client.music.players.get(message.guild.id);
    if (!player)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`There is nothing playing`)
      );

    const { queue } = player.queue;
    if (!queue.length)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`The current queue is empty`)
      );

    const itemsPerPage = 10;
    const maxPages = Math.ceil(queue.length / itemsPerPage);

    if (page > maxPages || page < 1) page = 1;

    const items = queue.slice(1).map((value) => {
        return {
          track: {
            title: decode(value.track).title,
            uri: decode(value.track).uri,
          },
        };
      }),
      display = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const embed = new LavaboatEmbed(message)
      .setAuthor(
        `Queue | ${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      )
      .addField(
        "Now Playing",
        `[${decode(queue[0].track).title}](${decode(queue[0].track).uri})`
      );

    if (queue.length > 1)
      embed.setDescription(
        display
          .map(
            (value, index) =>
              `\`#${Number(index + 1)
                .toString()
                .padStart(2, "0")}\` [\`${value.track.title}\`](${
                value.track.uri
              })`
          )
          .join("\n")
      );

    if (maxPages > 1)
      embed.setFooter(
        `Page: ${page} / ${maxPages}`,
        this.client.user.displayAvatarURL()
      );

    return message.util.send({ embed });
  }
}
