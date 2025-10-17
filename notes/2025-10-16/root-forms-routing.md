# Root Forms Routing Strategy

## Problem

Previous schema.org.ai implementations saved every verb conjugation and noun plural as separate files, leading to:
- Massive file duplication
- Unnecessary storage overhead
- Harder maintenance (changes need to be repeated)
- Confusion about canonical forms

## Solution

**Store only root forms on filesystem, handle variants at build/route time.**

## File Naming Conventions

### Nouns (Schema.org Types)
- **Capitalized** - `Thing.mdx`, `Person.mdx`, `Organization.mdx`
- Store singular form only
- Plurals handled at runtime

### Verbs and Properties
- **Lowercase** - `owns.mdx`, `name.mdx`, `email.mdx`
- Store base form only
- Conjugations handled at runtime

## Examples

### Storage (Filesystem)
```
content/schema.org/
├── Thing.mdx          # Root noun
├── Person.mdx         # Root noun
├── Organization.mdx   # Root noun
├── owns.mdx           # Root verb/property
├── name.mdx           # Root property
└── email.mdx          # Root property
```

### URLs (Runtime)
```
/Thing              → serves Thing.mdx (exact match)
/Things             → serves Thing.mdx (singularize)
/Person             → serves Person.mdx (exact match)
/Persons            → serves Person.mdx (singularize)
/People             → serves Person.mdx (irregular plural)
/owns               → serves owns.mdx (exact match)
/owned              → serves owns.mdx (past tense)
/owning             → serves owns.mdx (present participle)
```

## Implementation

### 1. Route Matching Logic

```typescript
// app/lib/routing.ts
export function resolveRootForm(slug: string): string {
  // Try exact match first
  const exactMatch = checkFileExists(slug)
  if (exactMatch) return slug

  // Try singularizing (for nouns)
  if (slug[0] === slug[0].toUpperCase()) {
    const singular = singularize(slug)
    if (checkFileExists(singular)) return singular
  }

  // Try de-conjugating (for verbs/properties)
  if (slug[0] === slug[0].toLowerCase()) {
    const baseForm = getBaseForm(slug)
    if (checkFileExists(baseForm)) return baseForm
  }

  return null // 404
}
```

### 2. Pluralization Rules

```typescript
// app/lib/pluralize.ts
const IRREGULAR_PLURALS: Record<string, string> = {
  'Person': 'People',
  'Child': 'Children',
  'Tooth': 'Teeth',
  'Foot': 'Feet',
  // ... more irregular forms
}

export function singularize(plural: string): string {
  // Check irregular forms first
  const irregular = Object.entries(IRREGULAR_PLURALS)
    .find(([_, p]) => p === plural)
  if (irregular) return irregular[0]

  // Standard rules
  if (plural.endsWith('ies')) {
    return plural.slice(0, -3) + 'y' // Companies → Company
  }
  if (plural.endsWith('es')) {
    return plural.slice(0, -2) // Businesses → Business
  }
  if (plural.endsWith('s')) {
    return plural.slice(0, -1) // Things → Thing
  }

  return plural
}
```

### 3. Verb Conjugation Rules

```typescript
// app/lib/conjugate.ts
export function getBaseForm(verb: string): string {
  // Past tense (-ed)
  if (verb.endsWith('ed')) {
    // owned → own
    // created → create
    const withoutEd = verb.slice(0, -2)
    if (withoutEd.endsWith('e')) {
      return withoutEd // created → create
    }
    return withoutEd + 'e' // owned → owne → own (needs refinement)
  }

  // Present participle (-ing)
  if (verb.endsWith('ing')) {
    // owning → own
    // creating → create
    const withoutIng = verb.slice(0, -3)
    if (checkFileExists(withoutIng + 'e')) {
      return withoutIng + 'e' // creating → create
    }
    return withoutIng // owning → own
  }

  // Third person singular (-s)
  if (verb.endsWith('s')) {
    return verb.slice(0, -1) // owns → own
  }

  return verb
}
```

### 4. Canonical URL Handling

Two approaches:

**A. Redirect to canonical (SEO-preferred)**
```typescript
// app/routes/[slug].tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params
  const rootForm = resolveRootForm(slug)

  if (!rootForm) {
    throw new Response('Not Found', { status: 404 })
  }

  // Redirect to canonical if different
  if (rootForm !== slug) {
    return redirect(`/${rootForm}`, 301)
  }

  const content = await loadContent(rootForm)
  return json({ content, rootForm })
}
```

**B. Serve with canonical link (UX-preferred)**
```typescript
// app/routes/[slug].tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params
  const rootForm = resolveRootForm(slug)

  if (!rootForm) {
    throw new Response('Not Found', { status: 404 })
  }

  const content = await loadContent(rootForm)
  return json({ content, rootForm, requestedSlug: slug })
}

// In component
export default function TypePage() {
  const { content, rootForm, requestedSlug } = useLoaderData<typeof loader>()
  const isCanonical = rootForm === requestedSlug

  return (
    <>
      {!isCanonical && (
        <link rel="canonical" href={`/${rootForm}`} />
      )}
      <article>{/* ... render content ... */}</article>
    </>
  )
}
```

## Benefits

1. **Simplified Storage**: 817 types + 1,518 properties = ~2,335 files instead of 10K+ with variants
2. **Single Source of Truth**: Update `Person.mdx` once, applies to all variants
3. **Easier Maintenance**: No need to sync changes across conjugations
4. **Clear Conventions**: Capitalized = Noun, lowercase = verb/property
5. **Flexible URLs**: Users can use any form, routes to correct content
6. **SEO-Friendly**: Canonical URLs prevent duplicate content issues

## Schema.org Specifics

### Type Hierarchy (Nouns)
```
Thing.mdx              # Root of all types
├── Action.mdx
├── CreativeWork.mdx
│   ├── Article.mdx
│   ├── Book.mdx
│   └── Movie.mdx
├── Event.mdx
├── Organization.mdx
├── Person.mdx
├── Place.mdx
└── Product.mdx
```

### Properties (lowercase)
```
name.mdx
email.mdx
telephone.mdx
url.mdx
description.mdx
image.mdx
```

### Relationships (lowercase verbs)
```
owns.mdx               # Organization owns Thing
manages.mdx            # Person manages Organization
creates.mdx            # Person creates CreativeWork
attends.mdx            # Person attends Event
```

## Implementation Phases

### Phase 1: Basic Routing (Immediate)
- Exact match lookup
- Simple pluralization (add/remove 's')
- Fallback to 404

### Phase 2: Advanced Pluralization (Week 1)
- Irregular plurals (Person → People)
- Complex rules (Company → Companies)
- Case sensitivity handling

### Phase 3: Verb Conjugation (Week 2)
- Past tense (-ed)
- Present participle (-ing)
- Third person (-s)
- Irregular verbs

### Phase 4: SEO Optimization (Week 3)
- Canonical URL redirects
- Sitemap with canonical forms only
- Structured data with canonical URLs
- Link rel="canonical" for variants

## Next Steps

1. Update `sites/schema.org.ai/app/lib/routing.ts` with root form resolution
2. Add pluralization helper to `sites/schema.org.ai/app/lib/pluralize.ts`
3. Update route handler to use resolution logic
4. Document canonical forms in Schema.org content
5. Generate content only for root forms (817 types + 1,518 properties)
