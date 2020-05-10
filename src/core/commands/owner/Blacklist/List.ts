import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { LavaboatEmbed } from "../../../../library/classes";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("blacklist-list", {
      args: [
        {
          id: "page",
          type: "number",
          default: 1,
        },
      ],
      category: "flag",
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const blacklist = this.client.db.get("global", "blacklist.users", []);
    if (!blacklist.length)
      return message.util.send(
        new LavaboatEmbed(message).setDescription(`The blacklist is empty.`)
      );

    const itemsPerPage = 5;
    const maxPages = Math.ceil(blacklist.length / itemsPerPage);

    if (page > maxPages || page < 1) page = 1;

    const items = blacklist.map((data) => {
      maxPages;
      return {
        id: data.id,
        date: data.date,
        reason: data.reason,
      };
    });

    let toDisplay = items.slice((page - 1) * itemsPerPage, page * itemsPerPage),
      str = ``;

    for (const { id, date, reason } of toDisplay) {
      str += `**User**: \`${(await this.client.users.fetch(id)).tag}\`
            **Date**: \`${new Date(date).toLocaleString("en-US")}\`
            **Reason**: \`${reason.substr(0, 45)}\`\n\n`;
    }

    const embed = new LavaboatEmbed(message)
      .setAuthor(
        `Blacklist | ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )
      .setDescription(str);

    if (maxPages > 1) embed.setFooter(`Page: ${page} / ${maxPages}`);

    return message.util.send({ embed });
  }
}
