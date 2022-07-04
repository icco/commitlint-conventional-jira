import { Commit, Plugin, RuleConfigCondition } from "@commitlint/types";
import { case as ensureCase } from "@commitlint/ensure";
import message from "@commitlint/message";

const negated = (when?: string) => when === "never";

export const commitlintConventionalJira: Plugin = {
  rules: {
    "subject-starts-jira": (
      parsed: Commit,
      when?: RuleConfigCondition | undefined,
      value?: undefined,
    ): [boolean, (string | undefined)?] => {
      const subject = parsed.subject ?? "";
      const matches = subject.match(/^(\([A-Z0-9]{2,6}-[0-9]{1,5})\): (.*)$/);
      const valid = matches !== null && matches.length === 3;
      return [
        negated(when) ? !valid : valid,
        "Jira ticket is missing or not of the format JIRA-1234",
      ];
    },
    "subject-case": (
      parsed: Commit,
      when?: RuleConfigCondition | undefined,
      value?: undefined,
    ): [boolean, (string | undefined)?] => {
      const subject = parsed.subject ?? "";
      const matches = subject.match(/^(\([A-Z0-9]{2,6}-[0-9]{1,5})\): (.*)$/);
      const stripedSubject = matches?.[2] ?? "";

      const checks = (Array.isArray(value) ? value : [value]).map((check) => {
        if (typeof check === "string") {
          return {
            when: "always",
            case: check,
          };
        }
        return check;
      });

      const result = checks.some((check) => {
        if (check === undefined) {
          return false;
        }

        const r = ensureCase(subject, check.case);
        return negated(check.when) ? !r : r;
      });

      const list = checks.map((c) => c?.case).join(", ");

      return [
        negated(when) ? !result : result,
        message([`subject must`, negated(when) ? `not` : null, `be ${list}`]),
      ];
    },
  },
};
