module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.json', './tests/e2e/tsconfig.e2e.json'],
        createDefaultProgram: true,
        tsconfigRootDir: __dirname,
      },
      extends: [
        'plugin:@angular-eslint/ng-cli-compat',
        'plugin:@angular-eslint/ng-cli-compat--formatting-add-on',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      rules: {
        '@typescript-eslint/ban-types': 'error',
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'aio',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'aio',
            style: 'camelCase',
          },
        ],
        'dot-notation': 'error',
        indent: 'off',
        'max-len': ['error', 140],
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            singleline: {
              delimiter: 'comma',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
        'no-empty-function': 'off',
        '@angular-eslint/no-host-metadata-property': 'off',
        'no-restricted-syntax': [
          'error',
          {
            selector: 'CallExpression[callee.name=/^(fdescribe|fit)$/]',
            message: "Don't keep jasmine focus methods.",
          },
        ],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-tabs': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': ['error'],
        'no-use-before-define': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
        quotes: 'off',
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
        semi: 'error',
        'jsdoc/newline-after-description': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/accessibility-alt-text': 'error',
        '@angular-eslint/template/accessibility-elements-content': 'error',
        '@angular-eslint/template/accessibility-label-has-associated-control': 'error',
        '@angular-eslint/template/accessibility-table-scope': 'error',
        '@angular-eslint/template/accessibility-valid-aria': 'error',
        '@angular-eslint/template/click-events-have-key-events': 'error',
        '@angular-eslint/template/eqeqeq': 'off',
        '@angular-eslint/template/mouse-events-have-key-events': 'error',
        '@angular-eslint/template/no-autofocus': 'error',
        '@angular-eslint/template/no-distracting-elements': 'error',
        '@angular-eslint/template/no-positive-tabindex': 'error',
      },
    },
  ],
};
