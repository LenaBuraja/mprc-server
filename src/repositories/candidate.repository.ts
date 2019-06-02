import { CreateCandidateForm } from "../forms/candidate.forms";
import knex, { Transaction } from "../knex";
import { Candidate, TABLE, CANDIDATE } from "../models";

export async function _createCandidate(
	candidate: Omit<CreateCandidateForm, 'person'> & { personId: number },
	tx: Transaction | typeof knex = knex,
): Promise<Candidate> {
	return await tx(TABLE.CANDIDATES).insert({
		[CANDIDATE.PERSON_ID]: candidate.personId,
		[CANDIDATE.PERSONNEL_OFFICER_ID]: candidate.personnerOfficerId,
		[CANDIDATE.INTERVIEWER_ID]: candidate.interviewerId,
		[CANDIDATE.INTERVIEWED_AT]: candidate.interviewedAt,
		[CANDIDATE.WAGE]: candidate.wage
	}).returning('*');
}
