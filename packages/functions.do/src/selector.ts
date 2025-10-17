/**
 * Function Selector - AI-powered function type selection and generation
 *
 * Analyzes function description and arguments to determine whether it should be:
 * - Code: Pure computation, deterministic logic
 * - Generative: AI-powered content creation
 * - Agentic: Multi-step reasoning with tools
 * - Human: Requires human judgment/approval
 *
 * Then generates the appropriate implementation (code, prompts, UI, etc.)
 */

import type { FunctionType, CodeFunction, GenerativeFunction, AgenticFunction, HumanFunction, Schema } from './types'

/**
 * Function Requirements - input to selector
 */
export interface FunctionRequirements {
  /** Function description/purpose */
  description: string

  /** Input parameter names and types */
  input: Record<string, string>

  /** Expected output type/structure */
  output?: string

  /** Additional context */
  context?: string

  /** Preferred model for AI functions */
  model?: string
}

/**
 * Selection Result
 */
export interface SelectionResult {
  /** Determined function type */
  type: FunctionType

  /** Confidence score (0-1) */
  confidence: number

  /** Reasoning for selection */
  reasoning: string

  /** Generated implementation */
  implementation: FunctionImplementation
}

/**
 * Function Implementation - generated code/prompts/ui
 */
export type FunctionImplementation = CodeImplementation | GenerativeImplementation | AgenticImplementation | HumanImplementation

export interface CodeImplementation {
  type: 'code'
  code: string
  runtime: 'node' | 'browser' | 'worker'
}

export interface GenerativeImplementation {
  type: 'generative'
  model: string
  systemPrompt: string
  userPrompt: string
  temperature: number
  maxTokens: number
}

export interface AgenticImplementation {
  type: 'agentic'
  model: string
  tools: string[]
  maxSteps: number
  instructions: string
}

export interface HumanImplementation {
  type: 'human'
  uiType: 'slack' | 'discord' | 'email' | 'web'
  uiCode: string // JSX code for UI rendering
  responseParser: string // Code to parse response
  timeout: number
  reminderInterval?: number
}

/**
 * Select function type based on requirements
 *
 * Uses GPT-5 to analyze requirements and determine optimal function type
 */
export async function selectFunctionType(
  requirements: FunctionRequirements,
  options?: {
    model?: string
    apiKey?: string
  }
): Promise<SelectionResult> {
  const model = options?.model || 'gpt-5'

  // Prepare analysis prompt
  const systemPrompt = `You are a function type classifier for the .do platform.

Analyze function requirements and determine the optimal type:

**Code Function**:
- Pure computation, deterministic logic
- No external data or AI needed
- Examples: math calculations, data transformations, parsing

**Generative Function**:
- AI-powered content creation
- Needs creativity or generation
- Schema-based structured output
- Examples: write blog post, generate email, create description

**Agentic Function**:
- Multi-step reasoning required
- Needs tools/actions (search, API calls, etc.)
- Complex workflows with decision points
- Examples: research topic, book travel, analyze market

**Human Function**:
- Requires human judgment or approval
- Subjective decisions
- Compliance/security reviews
- Examples: approve expense, review content, make hiring decision

Respond with JSON:
{
  "type": "code" | "generative" | "agentic" | "human",
  "confidence": 0.0 to 1.0,
  "reasoning": "explanation"
}`

  const userPrompt = `Analyze this function requirement:

Description: ${requirements.description}

Input parameters:
${Object.entries(requirements.input)
  .map(([name, type]) => `- ${name}: ${type}`)
  .join('\n')}

${requirements.output ? `Expected output: ${requirements.output}` : ''}
${requirements.context ? `Additional context: ${requirements.context}` : ''}

Determine the optimal function type.`

  // Call AI (placeholder - needs actual OpenAI integration)
  const response = await callAI(model, systemPrompt, userPrompt, options?.apiKey)

  // Generate implementation based on type
  const implementation = await generateImplementation(requirements, response.type, options)

  return {
    type: response.type,
    confidence: response.confidence,
    reasoning: response.reasoning,
    implementation,
  }
}

/**
 * Generate implementation for determined function type
 */
export async function generateImplementation(
  requirements: FunctionRequirements,
  type: FunctionType,
  options?: {
    model?: string
    apiKey?: string
  }
): Promise<FunctionImplementation> {
  switch (type) {
    case 'code':
      return generateCodeImplementation(requirements, options)
    case 'generative':
      return generateGenerativeImplementation(requirements, options)
    case 'agentic':
      return generateAgenticImplementation(requirements, options)
    case 'human':
      return generateHumanImplementation(requirements, options)
  }
}

/**
 * Generate Code Function implementation
 */
export async function generateCodeImplementation(
  requirements: FunctionRequirements,
  options?: { model?: string; apiKey?: string }
): Promise<CodeImplementation> {
  const model = options?.model || 'gpt-5-codex'

  const prompt = `Generate TypeScript code for this function:

Description: ${requirements.description}

Input parameters:
${Object.entries(requirements.input)
  .map(([name, type]) => `- ${name}: ${type}`)
  .join('\n')}

${requirements.output ? `Expected output: ${requirements.output}` : ''}

Generate a TypeScript function with this signature:
async function handler(input: Input, ctx: FunctionContext): Promise<Output>

Include:
- Input/output type definitions
- Proper error handling
- JSDoc comments
- Return the output matching the schema

Only return the code, no markdown formatting.`

  const code = await callAI(model, 'You are an expert TypeScript developer.', prompt, options?.apiKey)

  return {
    type: 'code',
    code: code.text,
    runtime: 'node',
  }
}

/**
 * Generate Generative Function implementation
 */
export async function generateGenerativeImplementation(
  requirements: FunctionRequirements,
  options?: { model?: string; apiKey?: string }
): Promise<GenerativeImplementation> {
  const model = requirements.model || 'gpt-5'

  const prompt = `Create prompts for a generative AI function:

Description: ${requirements.description}

Input parameters:
${Object.entries(requirements.input)
  .map(([name, type]) => `- ${name}: ${type}`)
  .join('\n')}

${requirements.output ? `Expected output: ${requirements.output}` : ''}

Generate:
1. System prompt: Instructions for the AI model
2. User prompt template: Use {{paramName}} for input parameters
3. Temperature: 0-2 (creativity level)
4. Max tokens: Estimated output length

Return JSON:
{
  "systemPrompt": "...",
  "userPrompt": "...",
  "temperature": 0.7,
  "maxTokens": 1000
}`

  const response = await callAI(options?.model || 'gpt-5', 'You are an expert prompt engineer.', prompt, options?.apiKey)

  return {
    type: 'generative',
    model,
    systemPrompt: response.systemPrompt,
    userPrompt: response.userPrompt,
    temperature: response.temperature,
    maxTokens: response.maxTokens,
  }
}

/**
 * Generate Agentic Function implementation
 */
export async function generateAgenticImplementation(
  requirements: FunctionRequirements,
  options?: { model?: string; apiKey?: string }
): Promise<AgenticImplementation> {
  const model = requirements.model || 'gpt-5'

  const prompt = `Design an agentic function:

Description: ${requirements.description}

Input parameters:
${Object.entries(requirements.input)
  .map(([name, type]) => `- ${name}: ${type}`)
  .join('\n')}

${requirements.output ? `Expected output: ${requirements.output}` : ''}

Determine:
1. What tools does the agent need? (search, api_call, database, code_execution, etc.)
2. What are the step-by-step instructions?
3. Maximum reasoning steps needed?

Return JSON:
{
  "tools": ["tool1", "tool2"],
  "instructions": "Step by step instructions...",
  "maxSteps": 10
}`

  const response = await callAI(options?.model || 'gpt-5', 'You are an AI agent designer.', prompt, options?.apiKey)

  return {
    type: 'agentic',
    model,
    tools: response.tools,
    maxSteps: response.maxSteps,
    instructions: response.instructions,
  }
}

/**
 * Generate Human Function implementation
 */
export async function generateHumanImplementation(
  requirements: FunctionRequirements,
  options?: { model?: string; apiKey?: string }
): Promise<HumanImplementation> {
  const prompt = `Generate a Slack BlockKit UI for this human-in-the-loop function:

Description: ${requirements.description}

Input parameters:
${Object.entries(requirements.input)
  .map(([name, type]) => `- ${name}: ${type}`)
  .join('\n')}

${requirements.output ? `Expected output: ${requirements.output}` : ''}

Generate JSX using jsx-slack:
1. Use <Blocks>, <Section>, <Actions>, <Button> components
2. Display all input parameters clearly
3. Include action buttons (approve/reject or custom actions)
4. Make it user-friendly and clear

Also generate a response parser function that extracts the output from button clicks.

Return JSON:
{
  "uiCode": "JSX code here",
  "responseParser": "function code here",
  "timeout": 3600000,
  "reminderInterval": 600000
}`

  const response = await callAI(options?.model || 'gpt-5-codex', 'You are an expert in Slack BlockKit and jsx-slack.', prompt, options?.apiKey)

  return {
    type: 'human',
    uiType: 'slack',
    uiCode: response.uiCode,
    responseParser: response.responseParser,
    timeout: response.timeout || 3600000,
    reminderInterval: response.reminderInterval,
  }
}

/**
 * Call AI model (placeholder - needs actual implementation)
 *
 * This should integrate with the actual AI worker or OpenAI SDK
 */
async function callAI(model: string, systemPrompt: string, userPrompt: string, apiKey?: string): Promise<any> {
  // TODO: Implement actual AI call
  // For now, return mock response
  throw new Error('AI integration not yet implemented - needs OpenAI SDK or AI worker binding')

  // Future implementation:
  // import { OpenAI } from 'openai'
  // const client = new OpenAI({ apiKey })
  // const response = await client.chat.completions.create({
  //   model,
  //   messages: [
  //     { role: 'system', content: systemPrompt },
  //     { role: 'user', content: userPrompt }
  //   ],
  //   response_format: { type: 'json_object' }
  // })
  // return JSON.parse(response.choices[0].message.content)
}
