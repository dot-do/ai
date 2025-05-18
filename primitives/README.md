# primitives

Low level building blocks used by the SDK examples.

```ts
import { AI, DB } from 'workflows.do'

const ai = AI({ hello: 'short greeting' })
const db = DB({ messages: {} })

await db.messages.create({ text: await ai.hello({}) })
```
