import { proto, WASocket } from "baileys";

export interface IParams {
  sock: WASocket;
  remoteJid: string;
  sendMessage: (message: string) => Promise<proto.WebMessageInfo | undefined>
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
