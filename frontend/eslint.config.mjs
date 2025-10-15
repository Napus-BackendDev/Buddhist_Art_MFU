// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
   {
    rules: {
      'no-unused-vars': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'no-console': 'error'
    }
   }
)
