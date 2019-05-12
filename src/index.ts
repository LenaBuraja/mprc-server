import { inspect } from "util";
import runMigrations from "./run-migrations";
import { init } from "./rest";

(async () => {
	await runMigrations();
	await init();
})().then(() => {
	console.log('Server started successful');
}).catch((err) => {
	console.error('!!! SERVER DROPPED BY ERROR !!!');
	console.error(err instanceof Error || typeof err !== 'object' ? err : inspect(err, false, null, true));
	process.exit(1);
});
