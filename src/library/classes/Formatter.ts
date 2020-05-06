import Logger, {
  Color,
  ColorUtil,
  DefaultFormatter,
  DefaultFormatterColor,
  LogLevel,
} from "@ayanaware/logger";
import fecha from "fecha";

Logger.getDefaultTransport().setLevel(LogLevel.TRACE);
Logger.setFormatter(
  new (class BotLogger extends DefaultFormatter {
    public formatTimestamp() {
      return ColorUtil.getFormatter(Color.GRAY)(
        fecha.format(Date.now() as any, "hh:mm MM/DD/YYYY")
      );
    }
  })({
    colorMap: new Map([
      [DefaultFormatterColor.LOG_PACKAGE_PATH, Color.BLUE],
      [DefaultFormatterColor.LOG_PACKAGE_NAME, Color.MAGENTA],
      [DefaultFormatterColor.LOG_UNIQUE_MARKER, Color.GRAY],
    ]),
  })
);
