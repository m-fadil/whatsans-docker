import { AnyMessageContent, delay, WAMessage, WASocket } from "baileys";
import { CustMiscMessageGenerationOptions, IParams, ReactionType } from "../types/type";
import { Chance } from "chance";
import { Arguments } from "yargs-parser";

const chance = new Chance();

export function paramsHandler(sock: WASocket, m: WAMessage, args: Arguments): IParams {
  const remoteJid = m.key.remoteJid!;
  const sender = m.key.participant || remoteJid;
  const fromGroup = remoteJid.endsWith("g.us");

  const sendMessage = async (
    message: AnyMessageContent | string,
    opts?: CustMiscMessageGenerationOptions,
  ): Promise<void> => {
    const content = typeof message === "string" ? { text: message } : message;

    const { isQuoted, ...options } = {
      quoted: opts?.isQuoted ? m : undefined,
      ...opts,
    };
    void isQuoted;

    await sock.presenceSubscribe(remoteJid);
    await sock.sendPresenceUpdate("composing", remoteJid);

    await delay(chance.integer({ min: 500, max: 2000 }));
    await sock.sendPresenceUpdate("paused", remoteJid);

    await sock.sendMessage(remoteJid, content, options);
  };

  const reaction = async (type: ReactionType = "ok") => {
    const emote = {
      ok: "👍",
      bad: "👎",
      warn: "⚠️",
      stop: "⛔",
      cross: "❌",
      check: "✔️",
      EQ: "⁉️",
    }[type];

    const reactionMessage = {
      react: {
        text: emote,
        key: m.key,
      },
    };
    await sock.sendMessage(remoteJid, reactionMessage);
  };

  return {
    sock,
    remoteJid,
    sender,
    fromGroup,
    sendMessage,
    reaction,
    args,
  };
}
