import Router from "koa-router";
import initRouter from "./init-router";
import { METHOD } from "../constants/rest.constants";
import { getAllPositions } from "../repositories/position.repository";

const positionRouter: Router = initRouter('/position', [{
	method: METHOD.GET,
	path: '/list',
	onlyAuthorized: true,
	handler: async () => await getAllPositions(),
}]);

export default positionRouter;
