import { Listener, Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";
import { LavaboatEmbed } from "../../../library/classes";

export default class MissingPermissionsListener extends Listener {
  public constructor() {
    super("missingPermissions", {
      emitter: "commandHandler",
      event: "missingPermissions",
    });
  }

  public exec(
    message: Message,
    command: Command,
    type: string,
    missing: string | string[]
  ): any {
    switch (missing) {
      case "DJ":
        return message.util.send(
          new LavaboatEmbed(message).setDescription(
            `You need to be a DJ for that.`
          )
        );
        break;
    }

    switch (type) {
      case "client":
        return message.util.send(
          new LavaboatEmbed(message).setDescription(
            `I am missing the permission${
              missing.length > 1 ? "s" : ""
            }: ${this.missingPermissions(
              message.guild.me,
              missing
            )} to use the command: \`${command}\``
          )
        );
        break;

      case "user":
        return message.util.send(
          new LavaboatEmbed(message).setDescription(
            `You are missing the permission${
              missing.length > 1 ? "s" : ""
            }: ${this.missingPermissions(
              message.member,
              missing
            )} to use the command: \`${command}\``
          )
        );
        break;
    }

    switch (missing) {
      case "nsfw":
        return message.util.send(
          new LavaboatEmbed(message).setDescription(
            `This channel is not \`NSFW\`. Please enter a \`NSFW\` channel.`
          )
        );
        break;
    }
  }

  public missingPermissions(user: GuildMember, permissions: any) {
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
