import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class RemoveCommand extends Command {
  public constructor() {
    super("remove", {
      aliases: ["remove", "rm", "delete", "del"],
      args: [
        {
          id: "position",
          type: "number",
          prompt: {
            start: "Please provide a position",
          },
        },
      ],
      description: {
        content: "Removes a song from the queue",
        usage: "remove { position }",
        examples: ["remove 1", "remove 3"],
      },
      channel: "guild",
      userPermissions: (msg: Message) => {
        if (msg.member.hasPermission("ADMINISTRATOR")) return null;
        const djRole = this.client.db.get(msg.guild.id, "config.djRole", null);

        if (djRole && !msg.member.roles.cache.has(djRole)) return "DJ";
      },
    });
  }

  public async exec(message: Message, { position }: { position: number }) {
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

    if (player.queue.queue[position - 1] === undefined)
      return message.util.send(
        new LavaboatEmbed(message)
          .setColor("#e03131")
          .setDescription(
            `The queue does not have the positon of: \`${position}\``
          )
      );

    player.queue.queue.splice(
      player.queue.queue.findIndex((value) => value === value[position - 1])
    );

    return message.util.send(
      new LavaboatEmbed(message).setDescription(
        `Successfully removed the queue position of: \`${position}\``
      )
    );
  }
}
