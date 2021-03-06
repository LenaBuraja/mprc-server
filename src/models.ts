export enum TABLE {
	MIGRATIONS = 'migrations',
	POSITIONS = 'positions',
	PEOPLE = 'people',
	EMPLOYEES = 'employees',
	CANDIDATES = 'candidates',
	USERS = 'users',
}

export enum TYPES {
	CANDIDATE_STATUS = 'candidate_status',
}

export enum CANDIDATE_STATUS {
	START = 'start',
	PROFILE = 'profile',
	TEST_EXECUTION = 'test execution',
	INTERVIEW = 'interview',
	DECISION_MAKING = 'decision-making',
	REJECT = 'reject',
	SUCCEED = 'succeed',
}

export const CandidateStatuses = [
	CANDIDATE_STATUS.START,
	CANDIDATE_STATUS.PROFILE,
	CANDIDATE_STATUS.TEST_EXECUTION,
	CANDIDATE_STATUS.INTERVIEW,
	CANDIDATE_STATUS.DECISION_MAKING,
	CANDIDATE_STATUS.REJECT,
	CANDIDATE_STATUS.SUCCEED,
];

export enum MIGRATION {
	ID = 'id',
	NAME = 'name',
	APPLIED_AT = 'applied_at',
}

export type Migration = { [key in MIGRATION]: {
	[MIGRATION.ID]: number;
	[MIGRATION.NAME]: string;
	[MIGRATION.APPLIED_AT]: Date;
}[key] };

export enum POSITION {
	ID = 'id',
	TITLE = 'title',
}

export type Position = { [key in POSITION]: {
	[POSITION.ID]: number;
	[POSITION.TITLE]: string;
}[key] };

export enum PERSON {
	ID = 'id',
	FIRST_NAME = 'first_name',
	LAST_NAME = 'last_name',
	MIDDLE_NAME = 'middle_name',
	BIRTHDAY = 'birthday',
	EMAIL = 'email',
	PHONE_NUMBER = 'phone_number',
}

export type Person = { [key in PERSON]: {
	[PERSON.ID]: number;
	[PERSON.FIRST_NAME]: string;
	[PERSON.LAST_NAME]: string;
	[PERSON.MIDDLE_NAME]: string | null;
	[PERSON.BIRTHDAY]: string | null;
	[PERSON.EMAIL]: string | null;
	[PERSON.PHONE_NUMBER]: string | null;
}[key] };

export enum EMPLOYEE {
	ID = 'id',
	PERSON = 'person',
	EMPLOYMENT_DATE = 'employment_date',
	POSITION = 'position',
	WAGE = 'wage',
}

export type Employee = { [key in EMPLOYEE]: {
	[EMPLOYEE.ID]: number;
	[EMPLOYEE.PERSON]: number;
	[EMPLOYEE.POSITION]: number;
	[EMPLOYEE.EMPLOYMENT_DATE]: Date;
	[EMPLOYEE.WAGE]: number;
}[key] }

export enum CANDIDATE {
	ID = 'id',
	PERSON_ID = 'person',
	POSITION_ID = 'position',
	PERSONNEL_OFFICER_ID = 'personnel_officer',
	INTERVIEWER_ID = 'interviewer',
	INTERVIEWED_AT = 'interviewed_at',
	STATUS = 'status',
	WAGE = 'wage',
}

export type Candidate = { [key in CANDIDATE]: {
	[CANDIDATE.ID]: number,
	[CANDIDATE.PERSON_ID]: number,
	[CANDIDATE.POSITION_ID]: number,
	[CANDIDATE.PERSONNEL_OFFICER_ID]: number,
	[CANDIDATE.INTERVIEWER_ID]: number,
	[CANDIDATE.INTERVIEWED_AT]: Date,
	[CANDIDATE.STATUS]: CANDIDATE_STATUS,
	[CANDIDATE.WAGE]: number,
}[key] }

export enum USER {
	ID = 'id',
	EMPLOYEE = 'employee',
	PASSWORD_HASH = 'password_hash',
	PASSWORD_TOKEN_HASH = 'password_token_hash',
}

export type User = { [key in USER]: {
	[USER.ID]: number;
	[USER.EMPLOYEE]: number;
	[USER.PASSWORD_HASH]: string | null;
	[USER.PASSWORD_TOKEN_HASH]: string | null;
}[key] };
