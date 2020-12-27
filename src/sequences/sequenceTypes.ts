export interface SeuqnceErrorMessage {
	errorMessage: string;
}

export type StringIteratorGeneratorFunction =
	() => IterableIterator<string>;

export type CreateGeneratorResult =
	StringIteratorGeneratorFunction
	| SeuqnceErrorMessage;

export type CreateSampleGeneratorResult =
	StringIteratorGeneratorFunction
	| SeuqnceErrorMessage
	| null;

export function isSequenceErrorMessage(o: any): o is SeuqnceErrorMessage {
	return typeof o === "object"
		&& typeof o["errorMessage"] === "string";
}

export type EnsureAllParametersAreSetResult =
	true
	| SeuqnceErrorMessage;