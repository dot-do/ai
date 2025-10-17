import { WORKFLOW_ID } from '@/lib/config'

export const runtime = 'edge'

interface CreateSessionRequestBody {
  workflow?: { id?: string | null } | null
  scope?: { user_id?: string | null } | null
  workflowId?: string | null
}

const DEFAULT_CHATKIT_BASE = 'https://api.openai.com'
const SESSION_COOKIE_NAME = 'chatkit_session_id'
const SESSION_COOKIE_MAX_AGE = parseInt(process.env.SESSION_COOKIE_MAX_AGE ?? '', 10) || 60 * 60 * 24 * 30 // 30 days by default

export async function POST(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return methodNotAllowedResponse()
  }
  let sessionCookie: string | null = null
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const parsedBody = await safeParseJson<CreateSessionRequestBody>(request)
    const { userId, sessionCookie: resolvedSessionCookie } = await resolveUserId(request)
    sessionCookie = resolvedSessionCookie
    const resolvedWorkflowId = parsedBody?.workflow?.id ?? parsedBody?.workflowId ?? WORKFLOW_ID

    if (process.env.NODE_ENV !== 'production') {
      console.info('[create-session] handling request', {
        resolvedWorkflowId,
        body: JSON.stringify(parsedBody),
      })
    }

    if (!resolvedWorkflowId) {
      return buildJsonResponse({ error: 'Missing workflow id' }, 400, { 'Content-Type': 'application/json' }, sessionCookie)
    }

    const apiBase = process.env.CHATKIT_API_BASE ?? DEFAULT_CHATKIT_BASE
    const url = `${apiBase}/v1/chatkit/sessions`
    const upstreamResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'chatkit_beta=v1',
      },
      body: JSON.stringify({
        workflow: { id: resolvedWorkflowId },
        user: userId,
      }),
    })

    if (process.env.NODE_ENV !== 'production') {
      console.info('[create-session] upstream response', {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
      })
    }

    const upstreamJson = (await upstreamResponse.json().catch(() => ({}))) as Record<string, unknown> | undefined

    if (!upstreamResponse.ok) {
      const upstreamError = extractUpstreamError(upstreamJson)
      console.error('OpenAI ChatKit session creation failed', {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        body: upstreamJson,
      })
      return buildJsonResponse(
        {
          error: upstreamError ?? `Failed to create session: ${upstreamResponse.statusText}`,
          details: upstreamJson,
        },
        upstreamResponse.status,
        { 'Content-Type': 'application/json' },
        sessionCookie
      )
    }

    const clientSecret = upstreamJson?.client_secret ?? null
    const expiresAfter = upstreamJson?.expires_after ?? null
    const responsePayload = {
      client_secret: clientSecret,
      expires_after: expiresAfter,
    }

    return buildJsonResponse(responsePayload, 200, { 'Content-Type': 'application/json' }, sessionCookie)
  } catch (error) {
    console.error('Create session error', error)
    return buildJsonResponse({ error: 'Unexpected error' }, 500, { 'Content-Type': 'application/json' }, sessionCookie)
  }
}

export async function GET(): Promise<Response> {
  return methodNotAllowedResponse()
}

function methodNotAllowedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function resolveUserId(request: Request): Promise<{
  userId: string
  sessionCookie: string | null
}> {
  const existing = getCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME)
  if (existing) {
    return { userId: existing, sessionCookie: null }
  }

  const generated = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).slice(2)

  const isSecure = new URL(request.url).protocol === 'https:'

  return {
    userId: generated,
    sessionCookie: serializeSessionCookie(generated, isSecure),
  }
}

function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null
  }

  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.split('=')
    if (!rawName || rest.length === 0) {
      continue
    }
    if (rawName.trim() === name) {
      return rest.join('=').trim()
    }
  }
  return null
}

function serializeSessionCookie(value: string, isSecure: boolean): string {
  const attributes = [`${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`, 'Path=/', `Max-Age=${SESSION_COOKIE_MAX_AGE}`, 'HttpOnly', 'SameSite=Lax']

  if (isSecure) {
    attributes.push('Secure')
  }
  return attributes.join('; ')
}

function buildJsonResponse(payload: unknown, status: number, headers: Record<string, string>, sessionCookie: string | null): Response {
  const responseHeaders = new Headers(headers)

  if (sessionCookie) {
    responseHeaders.append('Set-Cookie', sessionCookie)
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders,
  })
}

async function safeParseJson<T>(req: Request): Promise<T | null> {
  try {
    const text = await req.text()
    if (!text) {
      return null
    }
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

function extractUpstreamError(payload: Record<string, unknown> | undefined): string | null {
  if (!payload) return null

  // Check payload.error (string or object with message)
  const error = payload.error
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message?: unknown }).message
    if (typeof errorMessage === 'string') return errorMessage
  }

  // Check payload.details (string or nested error)
  const details = payload.details
  if (typeof details === 'string') return details
  if (details && typeof details === 'object' && 'error' in details) {
    const nestedError = (details as { error?: unknown }).error
    if (typeof nestedError === 'string') return nestedError
    if (nestedError && typeof nestedError === 'object' && 'message' in nestedError) {
      const nestedMessage = (nestedError as { message?: unknown }).message
      if (typeof nestedMessage === 'string') return nestedMessage
    }
  }

  // Check payload.message
  if (typeof payload.message === 'string') return payload.message

  return null
}
