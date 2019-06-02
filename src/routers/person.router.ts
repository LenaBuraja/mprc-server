import Router from "koa-router";
import initRouter from "./init-router";
import { METHOD } from "../constants/rest.constants";
import { getPeopleForm } from "../forms/person.forms";
import { getPeople } from "../services/person.service";

const personRouter: Router = initRouter('/person', [{
	method: METHOD.GET,
	path: '/list',
	reqParser: (ctx) => ctx.request.query,
	joi: getPeopleForm,
	handler: ({ form }) => getPeople(form),
}]);

export default personRouter;
