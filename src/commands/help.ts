import { commandsHandler } from "../handlers/commands.handler";
import { ICommand, IParams } from "../types/type";
import Cliui from "cliui";

const Help: ICommand = {
  name: "help",
  desc: "Show all commands",
  alias: ["h"],
  usage: ["help"],
  execute: async ({ sendMessage, fromGroup, args }: IParams) => {
    const { commandsMap, commands } = await commandsHandler();

    const listCommands = async (): Promise<void> => {
      const ui = Cliui({ width: 120 });
      const padding = [0, 0, 0, 0];

      ui.div({ text: "*daftar perintah:*", padding });
      commands
        .filter((command) => fromGroup || !command.forGroup)
        .map((command) => ui.div({ text: "> " + command.name, padding }));
      ui.div({ text: "selengkapnya gunakan _help <command>_", padding: [1, 0, 0, 0] });

      await sendMessage({ text: ui.toString() });
      ui.resetOutput();
    };

    const helpCommand = async (command: ICommand): Promise<void> => {
      const ui = Cliui({ width: 120 });
      const padding = [0, 0, 0, 0];

      ui.div({ text: "*description:*", padding });
      ui.div({ text: command.desc, padding });

      ui.div({ text: "*commands:*", padding: [1, 0, 0, 0] });
      command.usage.map((usage) => ui.div({ text: "> " + usage, padding }));

      if (command.alias) {
        ui.div({ text: "*alias:*", padding: [1, 0, 0, 0] });
        ui.div({ text: "> " + command.alias.join(", "), padding });
      }

      if (command.commands) {
        ui.div({ text: "*sub-commands:*", padding: [1, 0, 0, 0] });
        Array.from(commandsMap.keys()).map((command) => ui.div({ text: "> " + command, padding }));
        ui.div({ text: "detail perintah gunakan _help <command>_", padding: [1, 0, 0, 0] });
      }

      await sendMessage(ui.toString());
      ui.resetOutput();
    };

    const controller = async () => {
      const [inCommand] = args._.splice(0, 1) as string[];
      const command =
        commandsMap.get(inCommand) || commands.find((c) => c.alias?.includes(inCommand));

      if (!inCommand) return await listCommands();

      if (!command) return await sendMessage("*command tidak ditemukan*", { isQuoted: true });

      helpCommand(command);
    };

    await controller();
  },
};

export default Help;
