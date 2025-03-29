import { ICommand, IParams } from "../types/type";

const Ping: ICommand = {
  name: "ping",
  desc: "Ping the bot",
  alias: ["p"],
  usage: ["ping"],
  execute: async ({ sendMessage, reaction }: IParams) => {
    await sendMessage("pong!", { isQuoted: true });
  },
};

export default Ping;
