import { ParameterizedContext } from "koa";
import { METHOD } from "../constants/rest.constants";
import { User } from "../models";

interface IRouterHandlerProps {
	ctx: ParameterizedContext;
	user: User | null;
}

type IRouter = {
	method: METHOD,
	path: string,
	handler: (params: IRouterHandlerProps) => any,
};

export default IRouter;
