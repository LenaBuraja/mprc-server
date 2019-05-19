declare module "config" {

	export const pg: {
		user: string,
		host: string,
		database: string,
		password: string,
		port: number,
	};

	export const initialUser: {
		firstName: string,
		lastName: string,
		email: string,
		position: string,
	};

	export const mailer: {
		service: string,
		user: string,
		pass: string,
	};

	export const setPasswordPagePath: string;

}
