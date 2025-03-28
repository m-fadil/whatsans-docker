import { WASocket } from "baileys";

export interface IParams {
  sock: WASocket;
  remoteJid: string;
}

export interface ICommand {
  name: string;
  desc: string;
  alias?: string[];
  usage: string[];
  commands?: Map<string, ICommand>;
  execute(...params: any[]): Promise<void>;
}

export interface IFeature extends ICommand {
  forGroup?: boolean;
}
