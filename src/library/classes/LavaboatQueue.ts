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

    player.on("end", async e => {
      if (e && ["REPLACED", "STOPPED"].includes(e.reason)) return;

      const oldTrack = this.queue.shift();

      if (this.#message.guild.me.voice.channel.members.size === 1) {
        this.clean();

        this.#message.channel.send(
          new LavaboatEmbed(this.#message)
            .setDescription(`You abandoned me, so I have cleared the queue`)
            .setFooter("")
        );
      }

      if (this.repeat.track) this.queue.unshift(oldTrack);
      else if (this.repeat.queue) this.loopQueue(this.queue);

      if (!this.queue.length) return this.emit("finished");
      await player.play(this.queue[0].track);
    });

    player.on("start", async () => {
      if ((this.#message.client as AkairoClient).db.get(this.#message.guild.id, "config.announceNext", true))
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
          .setFooter("")
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
        new LavaboatEmbed(this.#message)
          .setDescription(
            `The queue has concluded. I will be leaving the voice channel. :wave:`
          )
          .setFooter("")
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
    if (!this.queue.length) this.queue = [];

    return this.queue.push({
      track,
      requester,
    });
  }

  public async clean() {
    this.queue = [];
    this.#oldQueue = [];
    this.current = undefined;
  }

  public async start(message: Message) {
    this.#message = message;
    if (!this.queue[0]) this.queue.shift();
    await this.player.play(this.queue[0].track);
  }
}
