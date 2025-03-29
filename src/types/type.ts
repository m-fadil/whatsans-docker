import { AnyMessageContent, MiscMessageGenerationOptions, WASocket } from "baileys";
import { Arguments } from "yargs-parser";

export type ReactionType = "ok" | "bad" | "warn" | "stop" | "cross" | "check" | "EQ";

export interface CustMiscMessageGenerationOptions extends MiscMessageGenerationOptions {
  isQuoted?: boolean;
}

export interface IParams {
  sock: WASocket;
  remoteJid: string;
  sender: string;
  fromGroup: boolean;
  sendMessage: (
    message: AnyMessageContent | string,
    opts?: CustMiscMessageGenerationOptions,
  ) => Promise<void>;
  reaction: (type?: ReactionType) => Promise<void>;
  args: Arguments;
}

export interface ICommand {
  name: string;
  desc: string;
  alias?: string[];
  usage: string[];
  commands?: Map<string, ICommand>;
  forGroup?: boolean;
  execute(params: IParams): Promise<void>;
}
