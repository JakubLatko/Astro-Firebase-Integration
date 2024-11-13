import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
	{ files: ["**/*.{js,mjs,cjs,ts,astro}"] },
	...eslintPluginAstro.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: globals.browser,
		},
		ignorePatterns: ["---"],
	},

	pluginJs.configs.recommended,
];
