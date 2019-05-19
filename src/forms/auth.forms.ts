import Joi from "joi";
import { PASSWORD_TOKEN_LENGTH } from "../constants/user.constants";

export interface SetPasswordForm {
	token: string;
	password: string;
}

export const setPasswordForm = Joi.object({
	token: Joi.string().lowercase().regex(/^[\da-f]*$/, "is not a hex").length(PASSWORD_TOKEN_LENGTH * 2).required(),
	password: Joi.string().min(6).required(),
});
