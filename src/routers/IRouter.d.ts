import { ObjectSchema } from "joi";
import { ParameterizedContext } from "koa";
import { METHOD } from "../constants/rest.constants";
import { User } from "../models";

type AnyForm = { [key: string]: any };

export interface IRouterHandlerProps<Form extends AnyForm> {
	ctx: ParameterizedContext;
	user: User | null;
	form: Form;
}

export type IController<Form = any> = (params: IRouterHandlerProps<Form>) => any;

type IRouter = {
	method: METHOD;
	path: string;
	reqParser?: (ctx: ParameterizedContext) => AnyForm;
	joi?: ObjectSchema;
	handler: IController;
};

export default IRouter;
