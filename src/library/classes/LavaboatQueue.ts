import { Player } from "lavaclient";
import { EventEmitter } from "events";
import { Queue, Repeat } from "../interfaces/Queue";
import { Message, User } from "discord.js";
import { LavaboatEmbed } from ".";
import { AkairoClient } from "discord-akairo";
import { decode } from "@lavalink/encoding";

export default class LavaboatQueue extends EventEmitter {
  public queue: Queue[] = [];
  public repeat: Repeat = { track: false, queue: false };

  #oldQueue: Queue[] = [];
  #message: Message;
  public current: Queue;

  public constructor(public player: Player) {
    super();

    player.on("end", async ({ reason }) => {
      if (["REPLACED", "STOPPED"].includes(reason)) return;

      const oldTrack = this.queue.shift();

      if (this.repeat.track) this.queue.unshift(oldTrack);
      else if (this.repeat.queue) this.loopQueue(this.queue);

      if (!this.queue[0]) return this.emit("finished");
      await player.play(this.queue[0].track);
    });

    player.on("start", async () => {
      this.#message.channel.send(
        new LavaboatEmbed(this.#message)
          .setDescription(
            `Now Playing:\n\n[${decode(this.queue[0].track).title}](${
              decode(this.queue[0].track).uri
            })`
          )
          .setThumbnail(
            `https://i.ytimg.com/vi/${
              decode(this.queue[0].track).identifier
            }/hqdefault.jpg`
          )
      );
    });

    this.on("finished", async () => {
      if (this.repeat.queue) {
        this.#oldQueue.forEach((track) => this.queue.push(track));

        return this.start(this.#message);
      }

      await this.player.destroy();
      await (this.#message.client as AkairoClient).music.leave(
        this.#message.guild.id
      );
      return this.#message.channel.send(
        new LavaboatEmbed(this.#message).setDescription(
          `The queue is hella empty, duces! :wave:`
        )
      );
    });
  }

  private loopQueue(tracks: Queue[]) {
    for (const track of tracks) {
      this.#oldQueue.push(track);
    }

    return this.#oldQueue;
  }

  public add(track: string, requester: User) {
    this.queue.push({
      track,
      requester,
    });

    return this.queue;
  }

  public async start(message: Message) {
    this.#message = message;
    if (!this.queue.length) return this.emit("finished");
    if (!this.queue[0]) this.queue.shift();
    await this.player.play(this.queue[0].track);
  }
}
