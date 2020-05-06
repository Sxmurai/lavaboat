import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { cpus, arch } from "os";
import { exec } from "child_process";

export default class StatsCommand extends Command {
  public constructor() {
    super("stats", {
      aliases: ["stats", "statisics", "info"],
      description: {
        content: "Shows the bot's stats",
      },
    });
  }

  public exec(message: Message) {
    let executed = exec(
      "cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release"
    );

    return message.util.send(
      [
        `> System Information`,
        ` CPU : ${cpus()[0].model}`,
        ` RAM : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB/s`,
        ` OS  : (${arch})`,
      ].join("\n"),
      { code: "md" }
    );
  }
}
