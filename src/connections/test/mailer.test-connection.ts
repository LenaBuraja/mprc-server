import { SendMailOptions } from "nodemailer";

export class TestMailerConnection {
	public mails: { [email: string]: SendMailOptions[] } = {};

	sendMail(params: SendMailOptions) {
		if (typeof params.to !== 'string') {
			throw new Error('not string receiver is not implemented in test environment');
		}
		if (!this.mails[params.to]) this.mails[params.to] = [params];
		else this.mails[params.to].push(params);
	}
}

export default new TestMailerConnection();
