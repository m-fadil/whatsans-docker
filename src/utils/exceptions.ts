export class CommandNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandNotFoundError";
    }
}

export class CommandError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandError";
    }
}

export class CommandUsageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandUsageError";
    }
}