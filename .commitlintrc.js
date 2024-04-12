module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lowerCase'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lowerCase'],
    'subject-case': [2, 'always', 'lowerCase'],
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 75],
    'header-case': [2, 'always', 'lowerCase'],
    'body-leading-blank': [2, 'always'],
    'body-max-length': [2, 'always', 300],
    'footer-leading-blank': [2, 'always'],
    'footer-max-length': [2, 'always', 100],
  },
};
