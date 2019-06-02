import Joi from "joi";
import { CreatePersonForm, createPersonForm } from "./person.forms";

export const createCandidateForm = Joi.object({
	person: Joi.alt([Joi.number().unsafe(false).integer().positive().required(), createPersonForm]),
	personnerOfficerId: Joi.number().unsafe(false).integer().positive().required(),
	interviewerId: Joi.number().unsafe(false).integer().positive().required(),
	interviewedAt: Joi.number().unsafe(false).integer().positive().default(null),
	wage: Joi.number().unsafe(false).integer().positive().default(null),
}).required();

export interface CreateCandidateForm {
	person: number | CreatePersonForm;
	personnerOfficerId: number;
	interviewerId: number;
	interviewedAt: number | null;
	wage: number | null;
}
