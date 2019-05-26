export enum REST_STATUS {
	OK = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	UNPROCESSABLE_ENTITY = 422,
	INTERNAL_SERVER_ERROR = 500
}

export enum METHOD {
	GET = 'get',
	POST = 'post',
}
