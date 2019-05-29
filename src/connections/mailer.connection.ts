import Mailer from "nodemailer/lib/mailer/index";

import { mailer } from "config";
import { createTransport } from "nodemailer";
import testMailerConnection from "./test/mailer.test-connection";

export default process.env.NODE_ENV !== 'test' ? createTransport({
	service: mailer.service,
	auth: { user: mailer.user, pass: mailer.pass },
}) : testMailerConnection;
