import { readdir } from "fs/promises";
import { ICommand } from "../types/type";

export async function commandHandler(): Promise<Map<string, ICommand>> {
	const files = await readdir(`./dist/commands`).then((cb) => cb.filter((file) => file.endsWith(".js")));

	const imports = files.map(async (file) => {
		const module = await import(`../commands/${file}`);
		return module.default as ICommand;
	});
	const commands = await Promise.all(imports);

	const commandsMap = new Map<string, ICommand>();
	commands.forEach((command) => {
		commandsMap.set(command.name, command);
	});

	return commandsMap;
}
