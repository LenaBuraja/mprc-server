import runServer from "../src";

before(async function () {
	this.timeout(5e3);
	await runServer();
});

import "./auth/auth.test";

