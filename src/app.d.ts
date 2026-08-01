import type { ErrorCode } from '#lib/errors/codes';

declare global {
	namespace App {
		interface Error {
			code: ErrorCode;
			title: string;
			message: string;
			/** Internal context for logs — never rendered to the traveller. */
			detail?: string;
		}
	}
}

export {};
