import { Command, Flag } from "discord-akairo";

export default class BugCommand extends Command {
  public constructor() {
    super("bug", {
      aliases: ["bug", "bugreport"],
      description: {
        content: "Reports a bug",
        usage: "bug [report, common] <[...arguments]>",
        examples: ["bug report repeat Bot will not repeat song", "bug common"],
      },
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["bug-report", "report", "rp"],
        ["bug-common", "common"],
      ],

      otherwise: () => {
        const prefix = config.get("bot.prefix");

        return `Run: \`${prefix}help bug\` to review the correct usage for this command`;
      },
    };

    return Flag.continue(method);
  }
}
