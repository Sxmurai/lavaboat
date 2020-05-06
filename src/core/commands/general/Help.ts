import { Command, Category } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../library/classes";

export default class HelpCommand extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "h", "commands", "cmds"],
      args: [
        {
          id: "command",
          type: "commandAlias",
          default: null,
        },
      ],
      description: {
        content: "Displays a command or all of the commands",
        usage: "help <command>",
        examples: ["help play", "help"],
      },
    });
  }

  public async exec(message: Message, { command }: { command: Command }) {
    if (!command) {
      const embed = new LavaboatEmbed(message).setAuthor(
        `Available commands for ${message.author.username}`,
        message.author.displayAvatarURL({ dynamic: true })
      );

      for (const [name, category] of this.handler.categories.filter(
        this.categoryFilter(message)
      )) {
        embed.addField(
          `• ${name.replace(/(\b\w)/gi, (str) => str.toUpperCase())} (${
            category.size
          })`,
          category
            .filter((cmd) => (cmd.aliases ? cmd.aliases.length > 0 : false))
            .map((cmd) => `\`${cmd.aliases[0]}\``)
            .join(", ") || "error rip"
        );
      }

      return message.util.send({ embed });
    }

    const { aliases, description } = command;
    const embed = new LavaboatEmbed(message)
      .setTitle(`**${description.usage || aliases[0]}**`)
      .addField(
        `• Main Information`,
        `**Aliases**: ${aliases.map((alias) => `\`${alias}\``).join(", ")}`
      )
      .addField(
        `• Other Information`,
        `${Object.keys(description)
          .map(
            (key) =>
              `**${key.replace(/(\b\w)/gi, (str) => str.toUpperCase())}**: ${
                Array.isArray(description[key])
                  ? `\n${description[key]
                      .map((value: string) => `\`${value}\``)
                      .join("\n")}`
                  : description[key]
              }`
          )
          .join("\n")}`,
        true
      )
      .setFooter(
        `<> - Optional, [] - Required`,
        this.client.user.displayAvatarURL()
      );

    return message.util.send({ embed });
  }

  private categoryFilter(message: Message) {
    return (c: Category<string, Command>) =>
      ![
        "flag",
        ...(this.client.ownerID.includes(message.author.id) || !message.guild
          ? []
          : message.member.hasPermission("MANAGE_GUILD", {
              checkAdmin: true,
              checkOwner: true,
            })
          ? ["owner", "flag"]
          : ["flag", "owner"]),
      ].includes(c.id);
  }
}
