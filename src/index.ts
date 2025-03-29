import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import { useSessions } from "./utils/auth";
import logger from "./utils/logger";
import { MessageHandler } from "./handlers/message.handler";
import { commandHandler } from "./handlers/commands.handler";

const startSock = async () => {
  const { state, saveCreds } = await useSessions("default");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    logger,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (
      connection === "close" &&
      (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.restartRequired
    ) {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log(
          "Koneksi terputus karena ",
          lastDisconnect?.error,
          ", hubugkan kembali!",
          shouldReconnect,
        );
        startSock();
      } else {
        console.log("Connection closed. You are logged out.");
      }
    }

    if (connection === "open") {
      console.log("opened connection");
    }

    if (qr) {
      console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
    }
  });

  sock.ev.on("messages.upsert", async ({ type, messages }) => {
    if (type === "notify" && !messages[0].key.fromMe) {
      try {
        if (typeof messages[0].key.remoteJid !== "string") {
          throw new Error("Invalid remoteJid");
        }

        await MessageHandler(sock, messages[0]);
      } catch (err) {
        console.log(err);
      }
    }
  });

  sock.ev.on("creds.update", async () => {
    await saveCreds();
  });

  return sock;
};

startSock();
