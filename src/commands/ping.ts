import { IFeature, IParams } from "../types/type";

const Ping: IFeature = {
  name: "ping",
  desc: "Ping the bot",
  alias: ["p"],
  usage: ["ping"],
  execute: async ({ sock, remoteJid }: IParams) => {
    await sock.sendMessage(remoteJid, { text: "Pong!" });
  }
}