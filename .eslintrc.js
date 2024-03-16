module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/naming-convention": [
            "error",
            { selector: "class", format: ["PascalCase"] },
            { selector: "classProperty", format: ["camelCase"] },
            { selector: "classMethod", format: ["camelCase"] },
            { selector: "variable", "modifiers": ["const", "global"], format: ["UPPER_CASE", "camelCase"]},
            { selector: "enum", format: ["PascalCase"] },
            { selector: "interface", format: ["PascalCase"] },
            { selector: "typeAlias", format: ["PascalCase"] },
        ],
        "@typescript-eslint/no-empty-interface": [
            "error",
            {
              "allowSingleExtends": true
            }
        ],
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "hoist": "all",
                "ignoreTypeValueShadow": true,
            }
        ],
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/quotes": [
            "warn",
            "double"
        ],
        "@typescript-eslint/semi": [
            "warn",
            "always"
        ],
        "brace-style": [
            "error",
            "1tbs"
        ],
        "curly": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "no-constant-condition": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-redeclare": "error",
        "no-trailing-spaces": "error",
        "no-throw-literal": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "quotes": ["error", "double"],
        "radix": "error",
        "semi": "error"
    }
};
