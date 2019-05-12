declare module "config" {
	export const pg: {
		user: string,
		host: string,
		database: string,
		password: string,
		port: number,
	};
}
