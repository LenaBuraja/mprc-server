import { ok as assert, strictEqual } from "assert";
import Fetch, { Response } from "node-fetch";

describe('GET /auth/me', () => {
	describe('when not logged', () => {
		let response: Response;
		it('should throws', async () => {
			response = await Fetch('http://127.0.0.1:3649/api/auth/me');
			assert(response.status >= 300);
		});
		it('with "unauthorized" status', () => strictEqual(response.status, 401));
		let body: any;
		it('with json in body', async () => body = await response.json());
		let status: number;
		it('with status', function () {
			if (!body) this.skip();
			status = body.status;
			assert(status !== undefined);
		});
		it('equals to status in response', function () {
			if (status === undefined) this.skip();
			strictEqual(status, response.status);
		});
		let error: string;
		it('with error message', function () {
			if (!body) this.skip();
			error = body.error;
			assert(error !== undefined);
		});
		it('equals to "unauthorized"', function () {
			if (error === undefined) this.skip();
			strictEqual(error, 'unauthorized');
		});
		it('without any other fields', function () {
			if (!body) this.skip();
			strictEqual(Object.keys(body).length, 2);
		});
	});
});
