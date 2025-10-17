import { wrapModule, createSDKGlobals } from './dist/wrapper.js';

const bindings = { RPC: {} };
const sdkGlobals = createSDKGlobals(bindings);
const code = wrapModule('1 + 1', undefined, { sdkGlobals, captureConsole: true });
console.log('=== GENERATED CODE ===');
console.log(code);
console.log('=== END CODE ===');
