import lint from "@commitlint/lint";
import { rules, parserPreset } from './index';

const messages = {
	invalidTypeEnum: "foo: some message",
	invalidTypeCase: "FIX: some message",
	invalidTypeEmpty: ": some message",
	invalidSubjectCases: [
		"fix(scope): Some message",
		"fix(scope): Some Message",
		"fix(scope): SomeMessage",
		"fix(scope): SOMEMESSAGE",
	],
	invalidSubjectEmpty: "fix:",
	invalidSubjectFullStop: "fix: some message.",
	invalidHeaderMaxLength:
		"fix: some message that is way too long and breaks the line max-length by several characters since the max is 100",
	warningFooterLeadingBlank:
		"fix: some message\n\nbody\nBREAKING CHANGE: It will be significant",
	invalidFooterMaxLineLength:
		'fix: some message\n\nbody\n\nBREAKING CHANGE: footer with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters',
	warningBodyLeadingBlank: "fix: some message\nbody",
	invalidBodyMaxLineLength:
		'fix: some message\n\nbody with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters',
	validMessages: [
		"fix: some message",
		"fix(scope): some message",
		"fix(scope): some Message",
		"fix(scope): some message\n\nBREAKING CHANGE: it will be significant!",
		"fix(scope): some message\n\nbody",
		"fix(scope)!: some message\n\nbody",
	],
};

test("type-enum", async () => {
	const result = await commitLint(messages.invalidTypeEnum);

	expect(result.valid).toBe(false);
});

test("type-case", async () => {
	const result = await commitLint(messages.invalidTypeCase);

	expect(result.valid).toBe(false);
});

test("type-empty", async () => {
	const result = await commitLint(messages.invalidTypeEmpty);

	expect(result.valid).toBe(false);
});

test("subject-case", async () => {
	const invalidInputs = await Promise.all(
		messages.invalidSubjectCases.map((invalidInput) =>
			commitLint(invalidInput),
		),
	);

	invalidInputs.forEach((result) => {
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([errors.subjectCase]);
	});
});

test("subject-empty", async () => {
	const result = await commitLint(messages.invalidSubjectEmpty);

	expect(result.valid).toBe(false);
});

test("subject-full-stop", async () => {
	const result = await commitLint(messages.invalidSubjectFullStop);

	expect(result.valid).toBe(false);
});

test("header-max-length", async () => {
	const result = await commitLint(messages.invalidHeaderMaxLength);

	expect(result.valid).toBe(false);
});

test("footer-leading-blank", async () => {
	const result = await commitLint(messages.warningFooterLeadingBlank, rules);

	expect(result.valid).toBe(true);
});

test("footer-max-line-length", async () => {
	const result = await commitLint(messages.invalidFooterMaxLineLength);

	expect(result.valid).toBe(false);
});

test("body-leading-blank", async () => {
	const result = await commitLint(messages.warningBodyLeadingBlank);

	expect(result.valid).toBe(true);
});

test("body-max-line-length", async () => {
	const result = await commitLint(messages.invalidBodyMaxLineLength);

	expect(result.valid).toBe(false);
});

test("valid messages", async () => {
	const validInputs = await Promise.all(
		messages.validMessages.map((input) => commitLint(input)),
	);

	validInputs.forEach((result) => {
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
	});
});

function commitLint(message: string) {
	return lint(message, rules, { ...preset });
}
