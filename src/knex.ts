import { pg } from "config";
import connect from "knex";

const knex = connect({
	client: 'pg',
	version: '10.7',
	connection: {
		host: pg.host,
		port: pg.port,
		user: pg.user,
		password: pg.password,
		database: pg.database,
	},
});

export default knex;
