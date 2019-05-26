import Router from "koa-router";

import initRouter from "./init-router";
import { METHOD } from "../constants/rest.constants";
import { createEmployeeForm } from "../forms/employee.forms";
import { createEmployeeController } from "../controllers/employee.controller";

const router: Router = initRouter('/employee', [{
	method: METHOD.POST,
	path: '/new',
	reqParser: (ctx) => ctx.request.body,
	joi: createEmployeeForm,
	onlyAuthorized: true,
	handler: createEmployeeController,
}]);

export default router;
