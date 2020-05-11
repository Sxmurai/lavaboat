import { User } from "discord.js";

export interface Queue {
  track: string;
  requester: User;
}

export interface Repeat {
  track: boolean;
  queue: boolean;
}
