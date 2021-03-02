module.exports = {
  root: true,
  plugins: ['import'],
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 0,
    'prefer-const': 1,
    'react/no-array-index-key': [1],
    'no-console': 'warn',
    'react/prop-types': 1,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};