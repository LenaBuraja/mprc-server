import { REST_STATUS } from "../constants/rest.constants";

export default class RestError extends Error {
	static get NAME() { return 'RestError'; }
	constructor(message: string, public status: REST_STATUS = REST_STATUS.INTERNAL_SERVER_ERROR) {
		super(message);
		this.name = RestError.NAME;
	}
}
