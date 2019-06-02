import Joi from "joi";
import { createPersonForm, CreatePersonForm } from "./person.forms";

export const createEmployeeForm = Joi.object({
	person: Joi.alt([Joi.number().unsafe(false).integer().positive().required(), createPersonForm]),
	position: Joi.string().required(),
	employmentDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
	wage: Joi.number().unsafe(false).integer().positive().required(),
}).required();

export interface CreateEmployeeForm {
	person: number | CreatePersonForm;
	position: string;
	employmentDate: string;
	wage: number;
}
