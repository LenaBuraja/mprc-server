import Joi from "joi";

export const createPersonForm = Joi.object({
	firstName: Joi.string().trim().required(),
	lastName: Joi.string().trim().required(),
	middleName: Joi.string().trim().default(null),
	birthday: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(null),
	email: Joi.string().email().default(null),
	phoneNumber: Joi.string().regex(/^\+[1-9]{1}[0-9]{3,14}$/).default(null),
}).required();

export interface CreatePersonForm {
	firstName: string;
	lastName: string;
	middleName: string | null;
	birthday: string | null;
	email: string | null;
	phoneNumber: string | null;
};

export const getPeopleForm = Joi.object({
	isEmployee: Joi.bool().default(null),
});

export interface GetPeopleForm {
	isEmployee: boolean | null;
}
