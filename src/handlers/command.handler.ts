import { readdir } from "fs/promises";
import { IFeature } from "../types/type";

export async function commandHandler(): Promise<Map<string, IFeature>> {
  const files = await readdir(`./dist/commands`).then((cb) => cb.filter((file) => file.endsWith('.js')));

  const imports = files.map((file) => import(`../commands/${file}`));
  const commands = await Promise.all(imports);

  const commandsMap = new Map<string, IFeature>();
  commands.forEach((command) => {
      commandsMap.set(command.name, command);
  });

  return commandsMap;
}