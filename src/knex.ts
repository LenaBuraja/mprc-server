import connect from "knex";

const knex = connect({
	client: 'pg',
	version: '10.7',
	connection: {
		host: '127.0.0.1',
		port: 5432,
		user: 'mprc_dev_user',
		password: '1234',
		database: 'mprc_dev',
	},
});

export default knex;
