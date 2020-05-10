import { Command } from "discord-akairo";
import { Message } from "discord.js";

import {
  LavaboatEmbed,
  LavaboatQueue,
  RestManager,
} from "../../../library/classes";

export default class PlayCommand extends Command {
  public constructor() {
    super("play", {
      aliases: ["play", "p"],
      args: [
        {
          id: "track",
          type: "string",
          match: "rest",
          prompt: {
            start: "Please provide a track name",
          },
        },

        {
          id: "type",
          type: ["youtube", "soundcloud"],
          flag: ["--type=", "-type"],
          default: "youtube",
        },
      ],
      description: {
        content: "Plays music in a voice channel",
        usage: "play [track] <type>",
        examples: [
          "play Let Her Go",
          "play Josh A - So Tired --type=soundcloud",
        ],
        types: ["youtube", "soundcloud"],
      },
    });
  }

  public async exec(
    message: Message,
    { track, type }: { track: string; type: string }
  ) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`Please join a voice channel`)
      );

    const missingPermissions = channel
      .permissionsFor(message.guild.me)
      .missing(["CONNECT", "SPEAK", "USE_VAD"]);
    if (missingPermissions.length)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(
            `I am missing the permission(s): ${this.missingPermissions(
              message.guild.me,
              missingPermissions
            )}`
          )
      );

    const player = await this.client.music.join(
      {
        channel: channel.id,
        guild: message.guild.id,
      },
      { deaf: true }
    );

    if (!player.queue) player.queue = new LavaboatQueue(player);

    const loadedTrack = await RestManager.loadTracks(
      track.includes("https://")
        ? track
        : `${type === "youtube" ? "ytsearch" : "scsearch"}:${track}`
    );

    switch (loadedTrack.loadType) {
      case "NO_MATCHES":
      case "LOAD_FAILED":
        return message.util.send(
          new LavaboatEmbed(message)
            .setColor("#db3b3b")
            .setDescription(
              `Nothing was found for your search query on ${type}.`
            )
        );
        break;

      case "PLAYLIST_LOADED":
        loadedTrack.tracks.map(({ track }) =>
          player.queue.add(track, message.author)
        );

        message.util.send(
          new LavaboatEmbed(message)
            .setThumbnail(
              `https://i.ytimg.com/vi/${loadedTrack.tracks[0].info.identifier}/hqdefault.jpg`
            )
            .setDescription(
              `Enqueued Playlist (\`${loadedTrack.tracks.length} Tracks\`):\n\n ${loadedTrack.playlistInfo.name}`
            )
        );

        if (!player.paused && !player.playing) await player.queue.start(message);

        break;

      case "TRACK_LOADED":
        player.queue.add(loadedTrack.tracks[0].track, message.author);

        message.util.send(
          new LavaboatEmbed(message)
            .setThumbnail(
              `https://i.ytimg.com/vi/${loadedTrack.tracks[0].info.identifier}/hqdefault.jpg`
            )
            .setDescription(
              `Enqueued Track:\n\n [${loadedTrack.tracks[0].info.title}](${loadedTrack.tracks[0].info.uri})`
            )
        );

        if (!player.paused && !player.playing) await player.queue.start(message);

        break;

      case "SEARCH_RESULT":
        const tracks = loadedTrack.tracks.slice(0, 5);

        const msg = await message.channel.send(
          new LavaboatEmbed(message)
            .setDescription(
              tracks.map(
                ({ info: { title, uri } }, index) =>
                  `\`#${index + 1}\` [\`${title}\`](${uri})`
              )
            )
            .setFooter(`Pick a track between 1-${tracks.length}`)
        );

        const filter = (msg: Message) => msg.author.id === message.author.id;

        msg.channel
          .awaitMessages(filter, { time: 3e4, errors: ["time"], max: 1 })
          .then(async (collected) => {
            const first = collected.first();

            if (first.content.toLowerCase() === "cancel")
              return message.util.send(`Cancelled the selection..`);

            if (!this.handler.resolver.type("number")(msg, first.content))
              return message.util.send(
                `Yeah uh, you need to pick a valid number next time..`
              );

            player.queue.add(
              tracks[Number(first.content) - 1].track,
              first.author
            );

            message.util.send(
              new LavaboatEmbed(message)
                .setThumbnail(
                  `https://i.ytimg.com/vi/${
                    loadedTrack.tracks[Number(first.content) - 1].info
                      .identifier
                  }/hqdefault.jpg`
                )
                .setDescription(
                  `Enqueued Track:\n\n [${
                    loadedTrack.tracks[Number(first.content) - 1].info.title
                  }](${loadedTrack.tracks[Number(first.content) - 1].info.uri})`
                )
            );

            if (!player.paused && !player.playing) await player.queue.start(message);
          })
          .catch(() => message.util.send(`Well, cancelled the selection.`));

        break;
    }
  }

  public missingPermissions(user: any, permissions: string[]) {
    const result = user.permissions.missing(permissions).map(
      (str) =>
        `\`${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
