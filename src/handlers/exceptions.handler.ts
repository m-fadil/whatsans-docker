import * as exceptions from "../utils/exceptions";
import { IParams } from "../types/type";

const exceptionsMap = [
    exceptions.CommandNotFoundError,
    exceptions.CommandError,
    exceptions.CommandUsageError,
]

export async function exceptionsHandler(error: any, params:IParams) {
    const { sendMessage } = params;
    
    if (exceptionsMap.some((exception) => error instanceof exception)) {
        await sendMessage(error.message, { isQuoted: true });
        console.error(error);
    }
    else {
        await sendMessage("An error occurred while executing the command", { isQuoted: true });
        console.error(error);
    }
}
