/**
 * Semantic Versioning: Verb Tenses & Naming Conventions
 *
 * Implements consistent semantic patterns across all types:
 * - Collections (plural): Multiple items (e.g., $.Orders, $.Customers)
 * - Items (singular): Single type (e.g., $.Order, $.Customer)
 * - Actions (future/infinitive): Functions to execute (e.g., $.Order.create)
 * - Activities (present continuous): Ongoing processes (e.g., $.Order.creating)
 * - Events (past tense): Completed actions (e.g., $.Order.created)
 */

/**
 * Collection type representing multiple items
 * @example $.Orders - Collection<Order>
 */
export type Collection<T> = T[]

/**
 * Item type representing a single entity
 * @example $.Order - Item<Order>
 */
export type Item<T> = T

/**
 * Action type representing a function to execute
 * @example $.Order.create - Action<OrderInput, Order>
 */
export type Action<TInput, TOutput> = (input: TInput) => Promise<TOutput>

/**
 * Activity state representing the current status of an ongoing process
 */
export type ActivityState = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'

/**
 * Activity type representing an ongoing process
 * @example $.Order.creating - Activity<Order>
 */
export type Activity<T> = {
  state: ActivityState
  data: T
  startedAt?: string
  completedAt?: string
  progress?: number
  error?: string
}

/**
 * Event type representing a completed action
 * @example $.Order.created - Event<Order>
 */
export type Event<T> = {
  timestamp: string
  data: T
  metadata?: Record<string, unknown>
}

/**
 * Irregular plural forms
 */
const IRREGULAR_PLURALS: Record<string, string> = {
  person: 'people',
  child: 'children',
  tooth: 'teeth',
  foot: 'feet',
  mouse: 'mice',
  goose: 'geese',
  man: 'men',
  woman: 'women',
  ox: 'oxen',
  sheep: 'sheep',
  deer: 'deer',
  fish: 'fish',
  species: 'species',
  series: 'series',
  analysis: 'analyses',
  basis: 'bases',
  crisis: 'crises',
  diagnosis: 'diagnoses',
  hypothesis: 'hypotheses',
  thesis: 'theses',
  phenomenon: 'phenomena',
  criterion: 'criteria',
  datum: 'data',
  octopus: 'octopuses',
  cactus: 'cacti',
  focus: 'foci',
  index: 'indices',
  matrix: 'matrices',
  appendix: 'appendices',
}

/**
 * Irregular past tense forms
 */
const IRREGULAR_PAST_TENSE: Record<string, string> = {
  send: 'sent',
  build: 'built',
  buy: 'bought',
  catch: 'caught',
  fight: 'fought',
  find: 'found',
  get: 'got',
  have: 'had',
  hear: 'heard',
  keep: 'kept',
  leave: 'left',
  lose: 'lost',
  make: 'made',
  meet: 'met',
  pay: 'paid',
  read: 'read',
  run: 'ran',
  say: 'said',
  sell: 'sold',
  set: 'set',
  sit: 'sat',
  speak: 'spoke',
  spend: 'spent',
  stand: 'stood',
  take: 'took',
  teach: 'taught',
  tell: 'told',
  think: 'thought',
  understand: 'understood',
  write: 'wrote',
  go: 'went',
  come: 'came',
  know: 'knew',
  see: 'saw',
  give: 'gave',
  bring: 'brought',
  begin: 'began',
  break: 'broke',
  choose: 'chose',
}

/**
 * Common exceptions for words ending in consonant + 'o'
 * These words take 's' instead of 'es' for plural
 * Note: This list is not exhaustive; add common words as needed
 */
const PHOTO_LIKE_WORDS = ['photo', 'piano', 'halo', 'solo', 'memo', 'logo', 'zero']

/**
 * Convert a word to plural form
 * Handles irregular plurals and common English pluralization rules
 *
 * @param word - The singular word to pluralize (non-empty string)
 * @returns The plural form of the word
 * @throws {Error} If word is empty or contains only whitespace
 *
 * @example
 * toPlural('order') // 'orders'
 * toPlural('person') // 'people'
 * toPlural('category') // 'categories'
 *
 * @remarks
 * - Expects single words (e.g., 'order', not 'shopping cart')
 * - Preserves the original case pattern (UPPER, Capitalized, lower)
 * - Mixed case inputs (e.g., 'aBc') may produce unexpected results
 */
export function toPlural(word: string): string {
  if (!word || !word.trim()) {
    throw new Error('toPlural: word cannot be empty')
  }

  const lower = word.toLowerCase()

  // Check for irregular plurals
  if (IRREGULAR_PLURALS[lower]) {
    return preserveCase(word, IRREGULAR_PLURALS[lower])
  }

  // Words ending in 'y' preceded by consonant: change 'y' to 'ies'
  if (/[^aeiou]y$/i.test(word)) {
    return appendWithCase(word.slice(0, -1), 'ies')
  }

  // Words ending in 'z': double z and add 'es'
  if (/z$/i.test(word)) {
    return appendWithCase(word + word[word.length - 1], 'es')
  }

  // Words ending in 's', 'ss', 'sh', 'ch', 'x': add 'es'
  if (/(?:s|ss|sh|ch|x)$/i.test(word)) {
    return appendWithCase(word, 'es')
  }

  // Words ending in 'f' or 'fe': change to 'ves'
  if (/fe?$/i.test(word)) {
    const stem = word.replace(/fe?$/i, '')
    return appendWithCase(stem, 'ves')
  }

  // Words ending in 'o' preceded by consonant: add 'es'
  // Exceptions: some words ending in consonant + 'o' add 's' instead of 'es'
  if (/[^aeiou]o$/i.test(word)) {
    if (PHOTO_LIKE_WORDS.includes(lower)) {
      return appendWithCase(word, 's')
    }
    return appendWithCase(word, 'es')
  }

  // Default: add 's'
  return appendWithCase(word, 's')
}

/**
 * Convert a verb to action form (infinitive/base form)
 * Already in infinitive form, so returns as-is
 *
 * This function exists for API consistency and semantic clarity when working with
 * verb transformations. While it's currently a passthrough, it provides a consistent
 * interface alongside toActivity() and toEvent(), and allows for future enhancements
 * such as verb normalization or validation.
 *
 * @param verb - The verb to convert (non-empty string)
 * @returns The action form (infinitive) of the verb
 * @throws {Error} If verb is empty or contains only whitespace
 *
 * @example
 * toAction('create') // 'create'
 * toAction('send') // 'send'
 */
export function toAction(verb: string): string {
  if (!verb || !verb.trim()) {
    throw new Error('toAction: verb cannot be empty')
  }
  return verb
}

/**
 * Convert a verb to activity form (present continuous)
 * Adds 'ing' suffix with proper handling of verb endings
 *
 * @param verb - The verb to convert (non-empty string)
 * @returns The activity form (present continuous) of the verb
 * @throws {Error} If verb is empty or contains only whitespace
 *
 * @example
 * toActivity('create') // 'creating'
 * toActivity('send') // 'sending'
 * toActivity('run') // 'running'
 *
 * @remarks
 * - CVC pattern doubling applies to stressed final syllables
 * - Common verbs like 'enter', 'offer' don't double (stress pattern limitation)
 * - This is acceptable for most Business-as-Code use cases
 */
export function toActivity(verb: string): string {
  if (!verb || !verb.trim()) {
    throw new Error('toActivity: verb cannot be empty')
  }
  // Double final consonant for CVC pattern (consonant-vowel-consonant)
  if (/[^aeiou][aeiou][^aeiou]$/i.test(verb) && verb.length > 2) {
    // Don't double 'w', 'x', 'y'
    const lastChar = verb[verb.length - 1].toLowerCase()
    if (lastChar !== 'w' && lastChar !== 'x' && lastChar !== 'y') {
      return verb + verb[verb.length - 1] + 'ing'
    }
  }

  // Words ending in 'ie': change to 'ying'
  if (/ie$/i.test(verb)) {
    return verb.slice(0, -2) + 'ying'
  }

  // Words ending in 'e' (not 'ee', 'oe', 'ye'): drop 'e' and add 'ing'
  if (/[^eoy]e$/i.test(verb)) {
    return verb.slice(0, -1) + 'ing'
  }

  // Default: add 'ing'
  return verb + 'ing'
}

/**
 * Convert a verb to event form (past tense)
 * Handles irregular past tense and regular conjugation rules
 *
 * @param verb - The verb to convert (non-empty string)
 * @returns The event form (past tense) of the verb
 * @throws {Error} If verb is empty or contains only whitespace
 *
 * @example
 * toEvent('create') // 'created'
 * toEvent('send') // 'sent'
 * toEvent('go') // 'went' (irregular)
 */
export function toEvent(verb: string): string {
  if (!verb || !verb.trim()) {
    throw new Error('toEvent: verb cannot be empty')
  }

  const lower = verb.toLowerCase()

  // Check for irregular past tense
  if (IRREGULAR_PAST_TENSE[lower]) {
    return preserveCase(verb, IRREGULAR_PAST_TENSE[lower])
  }

  // Words ending in 'e': add 'd'
  if (/e$/i.test(verb)) {
    return appendWithCase(verb, 'd')
  }

  // Words ending in consonant + 'y': change to 'ied'
  if (/[^aeiou]y$/i.test(verb)) {
    return appendWithCase(verb.slice(0, -1), 'ied')
  }

  // Double final consonant for CVC pattern (consonant-vowel-consonant)
  if (/[^aeiou][aeiou][^aeiouwxy]$/i.test(verb) && verb.length > 2) {
    return appendWithCase(verb + verb[verb.length - 1], 'ed')
  }

  // Default: add 'ed'
  return appendWithCase(verb, 'ed')
}

/**
 * Preserve the case pattern of the original word when applying transformations
 * @internal
 */
function preserveCase(original: string, transformed: string): string {
  // If original is all uppercase, return transformed as uppercase
  if (original === original.toUpperCase() && original !== original.toLowerCase()) {
    return transformed.toUpperCase()
  }

  // If original starts with uppercase, capitalize transformed
  if (original[0] === original[0].toUpperCase()) {
    return transformed[0].toUpperCase() + transformed.slice(1)
  }

  // Otherwise, return as-is
  return transformed
}

/**
 * Preserve the case pattern when appending a suffix
 * @internal
 */
function appendWithCase(word: string, suffix: string): string {
  // If word is all uppercase, return suffix in uppercase
  if (word === word.toUpperCase() && word !== word.toLowerCase()) {
    return word + suffix.toUpperCase()
  }

  // Otherwise return with lowercase suffix
  return word + suffix
}
