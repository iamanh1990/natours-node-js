module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [ 'eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended' ],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: [ 'react', '@typescript-eslint' ],
	rules: {
		'prettier/prettier': [ 'error', { endOfLine: 'auto' } ],
		'spaced-comment': 'off',
		'no-console': 'warn',
		'consistent-return': 'off',
		'func-names': 'off',
		'object-shorthand': 'off',
		'no-process-exit': 'off',
		'no-param-reassign': 'off',
		'no-return-await': 'off',
		'no-underscore-dangle': 'off',
		'class-methods-use-this': 'off',
		'prefer-destructuring': [ 'error', { object: true, array: false } ],
		'no-unused-vars': [ 'error', { argsIgnorePattern: 'req|res|next|val' } ],
		'no-const-assign': 'error'
	}
};
