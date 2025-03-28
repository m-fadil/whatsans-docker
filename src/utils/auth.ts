import {
	AuthenticationCreds,
	AuthenticationState,
	BufferJSON,
	initAuthCreds,
	proto,
	SignalDataSet,
	SignalDataTypeMap,
} from "baileys";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const sessionId = "default";

const useAuth = async () => {
	const getCreds = async (): Promise<AuthenticationCreds> => {
		const session = await prisma.authCreds.findUnique({
			where: { sessionId },
		});

		const creds = session ? (JSON.parse(session.creds, BufferJSON.reviver) as AuthenticationCreds) : initAuthCreds();

		return creds;
	};

	const creds = await getCreds();

	const state: AuthenticationState = {
		creds,
		keys: {
			async get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]) {
				const keys = await prisma.signalKey.findMany({
					where: { type, id: { in: ids } },
				});

				return Object.fromEntries(
					keys.map((k) => {
						try {
							if (type === "app-state-sync-key" && k.data) {
								return [k.id, proto.Message.AppStateSyncKeyData.fromObject(JSON.parse(k.data, BufferJSON.reviver))];
							}

							return [k.id, JSON.parse(k.data, BufferJSON.reviver) as SignalDataTypeMap[T]];
						} catch (error) {
							console.error(`Failed to parse key ${k.id}:`, error);
							return [k.id, {} as SignalDataTypeMap[T]];
						}
					})
				);
			},
			async set(data: SignalDataSet) {
				const entries = Object.entries(data).flatMap(([type, values]) =>
					Object.entries(values).map(([id, value]) => ({
						type,
						id,
						data: JSON.stringify(value, BufferJSON.replacer),
					}))
				);

				await prisma.$transaction(
					entries.map((entry) =>
						prisma.signalKey.upsert({
							where: { id: entry.id, type: entry.type },
							update: { data: entry.data },
							create: { ...entry },
						})
					)
				);
			},
			async clear() {
				await prisma.signalKey.deleteMany({});
			},
		},
	};

	const saveCreds = async (): Promise<void> => {
		await prisma.authCreds.upsert({
			where: { sessionId: sessionId },
			update: { creds: JSON.stringify(creds, BufferJSON.replacer) },
			create: { sessionId, creds: JSON.stringify(creds, BufferJSON.replacer) },
		});
	};

	return { state, saveCreds };
};

export { useAuth };
