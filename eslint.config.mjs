import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // 🔹 Your custom configuration
  {
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Custom rule adjustments
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      // ✅ UPDATED: Strict type safety - no 'any' types allowed
      '@typescript-eslint/no-explicit-any': 'error',

      // ✅ NEW: Console statements should use structured logger
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'], // Allow console.warn and console.error for legacy code
        },
      ],

      // Next.js rules
      '@next/next/no-html-link-for-pages': 'error',
      'import/no-unresolved': 'off',
      'import/named': 'off',
    },
  },
]);

export default eslintConfig;
