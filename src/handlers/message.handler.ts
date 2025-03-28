import { WAMessage, WASocket } from "baileys";
import { commandHandler } from "./command.handler";
import { paramsHandler } from "./params.handler";

export async function MessageHandler(sock: WASocket, m: WAMessage) {
  const incomingMessage =
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.conversation;

  if (!incomingMessage) return;

  if (!incomingMessage.startsWith(process.env.COMMAND_PREFIX!)) return;

  const inMessage = incomingMessage.substring(process.env.COMMAND_PREFIX!.length);
  const inArgs = inMessage.split(" ");
  await sock.readMessages([m.key]);

  const commnads = await commandHandler();
  const command = commnads.get(inArgs[0]);

  if (!command) return;

  await command.execute(paramsHandler(sock, m));
}