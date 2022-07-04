
export default {
  headerPattern: /^(\w*)(?:\((.*)\))?!?: \((.*)\): (.*)$/,
  headerCorrespondence: [
    'type',
    'scope',
    'issue',
    'subject'
  ],
  revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ['header', 'hash'],
}