import { CreateCandidateForm } from "../forms/candidate.forms";
import { Transaction } from "../knex";
import { Candidate, PERSON } from "../models";
import { findPersonById, createPerson } from "../repositories/person.repository";
import { personIsEmployee } from "../repositories/employee.repository";
import RestError from "../errors/RestError";
import { REST_STATUS } from "../constants/rest.constants";
import { _createCandidate } from "../repositories/candidate.repository";

export async function createCandidate(candidate: CreateCandidateForm, tx: Transaction): Promise<Candidate> {
	const person = typeof candidate.person === 'number'
		? await findPersonById(candidate.person, tx)
		: await createPerson(candidate.person, tx);
	if (await personIsEmployee(person[PERSON.ID], tx)) {
		throw new RestError('Candidate is already employee', REST_STATUS.UNPROCESSABLE_ENTITY);
	}
	return await _createCandidate({ ...candidate, personId: person[PERSON.ID] }, tx);
}
