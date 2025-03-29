import { WAMessage, WASocket } from "baileys";
import { commandsHandler } from "./commands.handler";
import { paramsHandler } from "./params.handler";
import parser from "yargs-parser";

export async function MessageHandler(sock: WASocket, m: WAMessage) {
  const incomingMessage =
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.conversation;

  if (!incomingMessage) return;

  if (!incomingMessage.startsWith(process.env.COMMAND_PREFIX!)) return;

  const inMessage = incomingMessage.substring(process.env.COMMAND_PREFIX!.length);
  const args = parser(inMessage);
	const [inCommand] = args._.splice(0, 1) as string[];
  await sock.readMessages([m.key]);

  const {commandsMap, commands} = await commandsHandler();
  const command =
    commandsMap.get(args[0]) || commands.find((c) => c.alias?.includes(inCommand));

  if (!command) return;

  await command.execute(paramsHandler(sock, m, args));
}
