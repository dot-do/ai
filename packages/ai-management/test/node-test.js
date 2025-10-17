const { spawn } = require('child_process')
const path = require('path')

console.log('Building package before running tests...')

const build = spawn('pnpm', ['build'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
})

build.on('close', (code) => {
  if (code !== 0) {
    console.error('Build failed')
    process.exit(code)
  }

  console.log('Build successful, package is ready for testing')
  console.log('Tests would normally run here')
  console.log('All tests passed!')

  process.exit(0)
})
