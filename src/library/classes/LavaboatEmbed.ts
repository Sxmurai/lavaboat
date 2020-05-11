import { Message, MessageEmbed } from "discord.js";

export class LavaboatEmbed extends MessageEmbed {
  public errorColor = "#db3b3b";
  public allowColor = "#3bdb83";
  public defaultColor = "#e32d2d";

  public constructor(public message: Message) {
    super();

    const dateOptions: object = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (!this.color) this.setColor(this.errorColor);
    if (!this.footer)
      this.footer = {
        text: `${this.message.client.user.username} • ${new Date(
          Date.now()
        ).toLocaleDateString("en-US", dateOptions)}`,
        iconURL: this.message.client.user.displayAvatarURL(),
      };
  }
}
