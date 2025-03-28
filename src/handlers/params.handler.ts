import { WAMessage, WASocket } from "baileys";
import { IParams } from "../types/type";

export function paramsHandler(sock: WASocket, m: WAMessage): IParams {
  const sendMessage = (message: string) => sock.sendMessage(m.key.remoteJid!, { text: message });

  return {
    sock,
    remoteJid:
    m.key.remoteJid!,
    sendMessage
  };
}