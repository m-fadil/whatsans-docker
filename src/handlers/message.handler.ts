import { WAMessage, WASocket } from "baileys";

export async function MessageHandler(sock: WASocket, m: WAMessage) {
  const incomingMessage =
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.conversation;

  if (!incomingMessage) return;

  if (!incomingMessage.startsWith(process.env.COMMAND_PREFIX!)) return;

  const inMessage = incomingMessage.substring(process.env.COMMAND_PREFIX!.length);
  await sock.readMessages([m.key]);

  console.log(m);
  console.log(inMessage);
}