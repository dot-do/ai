import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import base from './base.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...base,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/'],
  },
]
