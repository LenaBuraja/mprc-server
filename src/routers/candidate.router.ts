import Router from "koa-router"
import initRouter from "./init-router";
import { METHOD } from "../constants/rest.constants";
import { createCandidateForm } from "../forms/candidate.forms";
import { createCandidateController } from "../controllers/candidate.controller";

const candidateRouter: Router = initRouter('/candidate', [{
	method: METHOD.POST,
	path: '/new',
	reqParser: (ctx) => ctx.request.body,
	joi: createCandidateForm,
	onlyAuthorized: true,
	handler: createCandidateController,
}]);

export default candidateRouter;
