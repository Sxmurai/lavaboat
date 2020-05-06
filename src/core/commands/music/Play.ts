import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

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
    const { channel, id } = message.member.voice;
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

    const loadedTrack = await this.client.music.load(
      track,
      type === "youtube" ? "ytsearch" : "scsearch"
    );
    if (!loadedTrack.tracks.length)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#db3b3b")
          .setDescription(`Nothing was found for your search query on ${type}.`)
      );

    const player = await this.client.music.join(
      {
        channel: channel.id,
        guild: message.guild.id,
      },
      { deaf: true }
    );

    await player.play(loadedTrack.tracks[0].track);

    message.util.send(
      new LavaboatEmbed(message)
        .setColor("#3bdb83")
        .setDescription(`Now playing: \`${loadedTrack.tracks[0].info.title}\``)
    );

    player.on("end", async () => {
      await this.client.music.leave(message.guild.id);

      return message.channel.send(`The song has ended, I will leave now.`);
    });
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
