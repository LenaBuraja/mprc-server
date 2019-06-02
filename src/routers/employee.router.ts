import Router from "koa-router";
import initRouter from "./init-router";
import { METHOD } from "../constants/rest.constants";
import { createEmployeeController } from "../controllers/employee.controller";
import expandEmployee from "../expand/employee.expand";
import { createEmployeeForm } from "../forms/employee.forms";
import knex from "../knex";
import { getAllEmployees } from "../repositories/employee.repository";

const router: Router = initRouter('/employee', [{
	method: METHOD.POST,
	path: '/new',
	reqParser: (ctx) => ctx.request.body,
	joi: createEmployeeForm,
	onlyAuthorized: true,
	handler: createEmployeeController,
}, {
	method: METHOD.GET,
	path: '/list',
	onlyAuthorized: true,
	handler: async () => await knex.transaction(async (tx) => {
		const result = await getAllEmployees(tx);
		return await Promise.all(result.map(async (employee) => await expandEmployee(employee, { tx })));
	}),
}]);

export default router;
