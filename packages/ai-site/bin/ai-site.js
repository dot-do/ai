#!/usr/bin/env node

try {
  require('../dist/cli.js')
} catch (error) {
  require('../src/cli.ts')
}
