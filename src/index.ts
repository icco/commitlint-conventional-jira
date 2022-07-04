import { QualifiedConfig, Commit, RuleConfigCondition } from "@commitlint/types";

const negated = (when?: string) => when === "never";

const commitlintConventionalJira: QualifiedConfig = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?!?: \((.*)\)): (.*)$/,
      breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: \((.*)\)): (.*)$/,
      headerCorrespondence: [
        'type',
        'scope',
        'issue',
        'subject'
      ],
      noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
      revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
      revertCorrespondence: ['header', 'hash'],
    },
  },
  rules: {
    "has-jira-issue": (
      parsed: Commit,
      when?: RuleConfigCondition | undefined,
      value?: undefined,
    ): [boolean, (string | undefined)?] => {
      const issue = parsed.issue ?? "";
      const matches = issue.match(/^\([A-Z0-9]{2,6}-[0-9]{1,5})\)$/);
      const valid = matches !== null;
      return [
        negated(when) ? !valid : valid,
        "Jira ticket is missing or not of the format JIRA-1234",
      ];
    },
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};

module.exports = commitlintConventionalJira;