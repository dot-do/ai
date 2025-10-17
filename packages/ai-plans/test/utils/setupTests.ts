export function setupTestEnvironment() {
  if (!process.env.AI_GATEWAY_URL) {
    process.env.AI_GATEWAY_URL = 'https://api.llm.do'
  }
}
