declare module 'ai-props' {
  import { ReactNode } from 'react'

  interface AIProps {
    model: string
    prompt: string
    schema: Record<string, any>
    stream?: boolean
    children: (content: any, state: { isStreaming: boolean }) => ReactNode
  }

  export function AI(props: AIProps): JSX.Element
}
