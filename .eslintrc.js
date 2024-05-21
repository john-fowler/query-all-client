module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'airbnb',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        browser: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        project: ['./tsconfig.json'],
    },
    ignorePatterns: [
        '/**/node_modules/*',
        'babel.config.js',
        'jest.config.js',
        '__tests__/**/*.test.tsx',
    ],
    rules: {
        'prettier/prettier': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_.+' },
        ],
        '@typescript-eslint/no-use-before-define': 'warn',
        '@typescript-eslint/no-use-before-define': [
            'error',
            { variables: false },
        ],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/require-default-props': 'off',
        'react/prop-types': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: true },
        ],
        'import/order': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
                json: 'ignorePackages',
            },
        ],
        'import/no-unresolved': ['error', { caseSensitive: false }],
        'global-require': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/ban-types': 'off',
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['state'],
            },
        ],
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/jsx-filename-extension': [
            2,
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        ],
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@components', './src/components'],
                    ['@redux', './src/redux'],
                    ['@auth', './src/auth'],
                    ['@navigation', './src/navigation'],
                    ['@screens', './src/screens'],
                    ['@ms', './src/ms'],
                    ['@core', './src/core'],
                    ['@util', './src/util'],
                    ['@shared', './src/shared'],
                    ['@src', './src'],
                ],
                extensions: ['.js', '.ts', '.tsx'],
            },
        },
    },
    env: {
        jest: true,
    },
};
