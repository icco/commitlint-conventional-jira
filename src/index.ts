import CommitlintPlugin from "../@types"

export const commitlintConventionalJira: CommitlintPlugin = {
  rules: {
    'jira-ticket': (parsed, when, value): (string | boolean)[] => {

      return [false, 'Jira ticket is missing or not of the format JIRA-1234']
    },
  }
}

export default commitlintConventionalJira
