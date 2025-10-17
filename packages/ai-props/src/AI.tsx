import React, { useState, useEffect } from 'react'
import { generateObject } from 'ai-functions'
import { model as createModel } from 'ai-providers'
import { z } from 'zod'
import { AIProps, StreamObjectOptions, StreamObjectResult } from './types'

/**
 * Convert a simple object schema to a Zod schema
 */
const createSchemaFromObject = (obj: Record<string, any>): z.ZodType<any> => {
  const schemaObj: Record<string, z.ZodType<any>> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (value.includes('|')) {
        const options = value.split('|').map((opt) => opt.trim())
        schemaObj[key] = z.enum(options as [string, ...string[]])
      } else {
        schemaObj[key] = z.string().describe(value)
      }
    } else if (typeof value === 'number') {
      schemaObj[key] = z.number()
    } else if (typeof value === 'boolean') {
      schemaObj[key] = z.boolean()
    } else if (Array.isArray(value)) {
      schemaObj[key] = z.array(z.any())
    } else if (typeof value === 'object' && value !== null) {
      schemaObj[key] = createSchemaFromObject(value)
    } else {
      schemaObj[key] = z.any()
    }
  })

  return z.object(schemaObj)
}

/**
 * Stream an object from the AI model
 */
export const streamObject = async (options: StreamObjectOptions): Promise<StreamObjectResult> => {
  const { model, prompt, schema, ...rest } = options

  const stream = await model.streamComplete({
    prompt,
    ...rest,
  })

  let buffer = ''
  let currentObject: any = {}

  const objectStream = {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          for await (const chunk of stream) {
            buffer += chunk.text

            try {
              const jsonObject = JSON.parse(buffer)
              currentObject = schema && schema.parse ? schema.parse(jsonObject) : jsonObject
              return { value: currentObject, done: false }
            } catch (e) {}
          }

          try {
            const jsonObject = JSON.parse(buffer)
            currentObject = schema && schema.parse ? schema.parse(jsonObject) : jsonObject
            return { value: currentObject, done: true }
          } catch (e) {
            return { value: currentObject, done: true }
          }
        },
        async return() {
          return { value: undefined, done: true }
        },
        async throw(e?: any) {
          return { value: undefined, done: true }
        },
      }
    },
  }

  return { objectStream }
}

/**
 * AI component for generating props for React components
 */
export const AI: React.FC<AIProps> = ({
  model: modelInput,
  schema: schemaInput,
  prompt,
  stream = false,
  output = 'object',
  cols = 1,
  apiEndpoint,
  children,
}) => {
  const [result, setResult] = useState<any>(output === 'array' ? [] : {})
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelInstance = typeof modelInput === 'string' ? createModel(modelInput) : modelInput

        const schema = typeof schemaInput === 'object' && !('parse' in schemaInput) ? createSchemaFromObject(schemaInput) : (schemaInput as z.ZodType<any>)

        if (stream) {
          setIsStreaming(true)

          try {
            const { objectStream } = await streamObject({
              model: modelInstance,
              prompt,
              schema,
              output: output as 'object' | 'array',
            })

            for await (const obj of objectStream) {
              setResult(obj)
            }
          } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)))
          } finally {
            setIsStreaming(false)
          }
        } else {
          const response = await generateObject({
            model: modelInstance,
            prompt,
            schema,
            output,
          })

          setResult(response.object)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsStreaming(false)
      }
    }

    fetchData()
  }, [modelInput, schemaInput, prompt, stream, output, apiEndpoint])

  if (output === 'array' && Array.isArray(result) && children) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '1rem',
        }}
      >
        {result.map((item, index) => (
          <div key={index}>{children(item, { isStreaming, error })}</div>
        ))}
      </div>
    )
  }

  return children ? children(result, { isStreaming, error }) : null
}
