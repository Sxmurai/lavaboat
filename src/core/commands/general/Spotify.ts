import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class SpotifyCommand extends Command {
  public constructor() {
    super("spotify", {
      aliases: ["spotify"],
      args: [
        {
          id: "member",
          type: "member",
          default: (_) => _.member,
        },
      ],
      description: {
        content: "Displays the song the user is playing on spotify",
        usage: "spotify <member>",
        examples: ["spotify @Gavin", "spotify"],
      },
      channel: "guild",
    });
  }

  public exec(message: Message, { member }: { member: GuildMember }) {
    if (
      !member.presence.activities.some(
        (activity) => activity.name === "Spotify"
      )
    )
      return message.reply(
        `this member is not listening to spotify right now.`
      );

    const activity = member.presence.activities.find(
      (activity) => activity.name === "Spotify"
    );

    return message.util.send(
      new LavaboatEmbed(message)
        .setColor("#3bdb83")
        .setAuthor(
          `Spotify - ${member.user.username}`,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          [
            `**Author**: ${activity.state || "Unknown"}`,
            `**Song**: ${activity.details || "Unkwown"}`,
            `**Started**: ${new Date(
              activity.timestamps.start || Date.now()
            ).toLocaleString()}`,
          ].join("\n")
        )
        .setThumbnail(activity.assets.largeImageURL())
    );
  }
}
