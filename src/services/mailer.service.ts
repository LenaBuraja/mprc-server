import { mailer } from "config";
import { readFile } from "fs-extra";
import { compile, TemplateDelegate } from "handlebars";
import { createTransport } from "nodemailer";

const transporter = createTransport({
	service: mailer.service,
	auth: { user: mailer.user, pass: mailer.pass },
});

export enum MAIL {
	GOT_ACCESS = 'got-access',
};

export type MailParams = { [key in MAIL]: {
	[MAIL.GOT_ACCESS]: {
		name: string,
		token_url: string,
	},
}[key] };

export const subjectOf: { [key in MAIL]: string } = {
	[MAIL.GOT_ACCESS]: 'Got access to MPRC-service',
};

export async function sendMail(mail: MAIL, to: string, context: MailParams[typeof mail]) {
	const { text, html } = await getMail(mail);
	const mailParams = {
		from: mailer.user,
		to,
		subject: subjectOf[mail],
		text: text(context),
		html: html(context),
	};
	return await transporter.sendMail(mailParams);
}

const mails: { [key in MAIL]?: { text: TemplateDelegate, html: TemplateDelegate } } = {};

export async function getMail(mail: MAIL) {
	const templates = mails[mail];
	if (typeof templates !== 'undefined') return templates;
	const [text, html] = await Promise.all(['text', 'html'].map(async (type) => {
		const file = await readFile(`${__dirname}/../emails/${mail}.email.${type}.handlebars`, 'utf8');
		return compile(file, { noEscape: true });
	}));
	return mails[mail] = { text, html };
}
