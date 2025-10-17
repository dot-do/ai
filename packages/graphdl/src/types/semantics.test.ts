/**
 * Tests for semantic naming convention helpers
 */

import { describe, it, expect } from 'vitest'
import { toPlural, toAction, toActivity, toEvent } from './semantics'

describe('toPlural', () => {
  it('should handle regular plurals', () => {
    expect(toPlural('order')).toBe('orders')
    expect(toPlural('customer')).toBe('customers')
    expect(toPlural('product')).toBe('products')
    expect(toPlural('item')).toBe('items')
  })

  it('should handle irregular plurals', () => {
    expect(toPlural('person')).toBe('people')
    expect(toPlural('child')).toBe('children')
    expect(toPlural('tooth')).toBe('teeth')
    expect(toPlural('foot')).toBe('feet')
    expect(toPlural('mouse')).toBe('mice')
    expect(toPlural('man')).toBe('men')
    expect(toPlural('woman')).toBe('women')
  })

  it('should handle words ending in y', () => {
    expect(toPlural('category')).toBe('categories')
    expect(toPlural('city')).toBe('cities')
    expect(toPlural('company')).toBe('companies')
    expect(toPlural('day')).toBe('days') // vowel before y
  })

  it('should handle words ending in s, ss, sh, ch, x, z', () => {
    expect(toPlural('class')).toBe('classes')
    expect(toPlural('box')).toBe('boxes')
    expect(toPlural('dish')).toBe('dishes')
    expect(toPlural('church')).toBe('churches')
    expect(toPlural('quiz')).toBe('quizzes')
  })

  it('should handle words ending in f or fe', () => {
    expect(toPlural('leaf')).toBe('leaves')
    expect(toPlural('knife')).toBe('knives')
    expect(toPlural('life')).toBe('lives')
    expect(toPlural('wolf')).toBe('wolves')
  })

  it('should handle words ending in o', () => {
    expect(toPlural('hero')).toBe('heroes')
    expect(toPlural('potato')).toBe('potatoes')
    expect(toPlural('tomato')).toBe('tomatoes')
    expect(toPlural('photo')).toBe('photos') // vowel before o
  })

  it('should preserve case', () => {
    expect(toPlural('Order')).toBe('Orders')
    expect(toPlural('Person')).toBe('People')
    expect(toPlural('ORDER')).toBe('ORDERS')
  })

  it('should handle newly added irregular plurals', () => {
    expect(toPlural('octopus')).toBe('octopuses')
    expect(toPlural('cactus')).toBe('cacti')
    expect(toPlural('focus')).toBe('foci')
    expect(toPlural('index')).toBe('indices')
    expect(toPlural('matrix')).toBe('matrices')
    expect(toPlural('appendix')).toBe('appendices')
  })

  it('should handle photo-like exceptions', () => {
    expect(toPlural('memo')).toBe('memos')
    expect(toPlural('logo')).toBe('logos')
    expect(toPlural('zero')).toBe('zeros')
  })

  it('should throw error for empty strings', () => {
    expect(() => toPlural('')).toThrow('toPlural: word cannot be empty')
    expect(() => toPlural('   ')).toThrow('toPlural: word cannot be empty')
  })
})

describe('toAction', () => {
  it('should return verb in infinitive form', () => {
    expect(toAction('create')).toBe('create')
    expect(toAction('send')).toBe('send')
    expect(toAction('update')).toBe('update')
    expect(toAction('delete')).toBe('delete')
    expect(toAction('process')).toBe('process')
  })

  it('should throw error for empty strings', () => {
    expect(() => toAction('')).toThrow('toAction: verb cannot be empty')
    expect(() => toAction('   ')).toThrow('toAction: verb cannot be empty')
  })
})

describe('toActivity', () => {
  it('should handle regular verbs', () => {
    expect(toActivity('send')).toBe('sending')
    expect(toActivity('process')).toBe('processing')
    expect(toActivity('build')).toBe('building')
  })

  it('should handle verbs ending in e', () => {
    expect(toActivity('create')).toBe('creating')
    expect(toActivity('update')).toBe('updating')
    expect(toActivity('delete')).toBe('deleting')
    expect(toActivity('compile')).toBe('compiling')
  })

  it('should double final consonant for CVC pattern', () => {
    expect(toActivity('run')).toBe('running')
    expect(toActivity('get')).toBe('getting')
    expect(toActivity('put')).toBe('putting')
    expect(toActivity('ship')).toBe('shipping')
  })

  it('should handle verbs ending in ie', () => {
    expect(toActivity('lie')).toBe('lying')
    expect(toActivity('die')).toBe('dying')
    expect(toActivity('tie')).toBe('tying')
  })

  it('should not double w, x, y', () => {
    expect(toActivity('flow')).toBe('flowing')
    expect(toActivity('fix')).toBe('fixing')
    expect(toActivity('play')).toBe('playing')
  })

  it('should handle short verbs', () => {
    expect(toActivity('go')).toBe('going')
    expect(toActivity('do')).toBe('doing')
  })

  it('should throw error for empty strings', () => {
    expect(() => toActivity('')).toThrow('toActivity: verb cannot be empty')
    expect(() => toActivity('   ')).toThrow('toActivity: verb cannot be empty')
  })
})

describe('toEvent', () => {
  it('should handle regular verbs', () => {
    expect(toEvent('create')).toBe('created')
    expect(toEvent('update')).toBe('updated')
    expect(toEvent('delete')).toBe('deleted')
    expect(toEvent('process')).toBe('processed')
  })

  it('should handle irregular past tense', () => {
    expect(toEvent('send')).toBe('sent')
    expect(toEvent('build')).toBe('built')
    expect(toEvent('buy')).toBe('bought')
    expect(toEvent('catch')).toBe('caught')
    expect(toEvent('find')).toBe('found')
    expect(toEvent('make')).toBe('made')
    expect(toEvent('write')).toBe('wrote')
  })

  it('should handle verbs ending in y', () => {
    expect(toEvent('apply')).toBe('applied')
    expect(toEvent('deploy')).toBe('deployed') // vowel before y
    expect(toEvent('carry')).toBe('carried')
    expect(toEvent('try')).toBe('tried')
  })

  it('should double final consonant for CVC pattern', () => {
    expect(toEvent('stop')).toBe('stopped')
    expect(toEvent('ship')).toBe('shipped')
    expect(toEvent('plan')).toBe('planned')
  })

  it('should preserve case', () => {
    expect(toEvent('Create')).toBe('Created')
    expect(toEvent('Send')).toBe('Sent')
    expect(toEvent('CREATE')).toBe('CREATED')
  })

  it('should handle newly added irregular verbs', () => {
    expect(toEvent('go')).toBe('went')
    expect(toEvent('come')).toBe('came')
    expect(toEvent('know')).toBe('knew')
    expect(toEvent('see')).toBe('saw')
    expect(toEvent('give')).toBe('gave')
    expect(toEvent('bring')).toBe('brought')
    expect(toEvent('begin')).toBe('began')
    expect(toEvent('break')).toBe('broke')
    expect(toEvent('choose')).toBe('chose')
  })

  it('should preserve case for irregular verbs', () => {
    expect(toEvent('Go')).toBe('Went')
    expect(toEvent('GO')).toBe('WENT')
    expect(toEvent('Write')).toBe('Wrote')
    expect(toEvent('WRITE')).toBe('WROTE')
  })

  it('should throw error for empty strings', () => {
    expect(() => toEvent('')).toThrow('toEvent: verb cannot be empty')
    expect(() => toEvent('   ')).toThrow('toEvent: verb cannot be empty')
  })
})

describe('multi-word inputs', () => {
  it('toPlural should handle multi-word inputs by pluralizing last word', () => {
    // Note: These functions are designed for single words
    // Multi-word strings will only transform the final word
    expect(toPlural('shopping cart')).toBe('shopping carts')
    expect(toPlural('credit card')).toBe('credit cards')
  })

  it('toActivity should handle multi-word inputs by transforming last word', () => {
    // Note: Multi-word strings are not recommended
    // Only the last word will be transformed
    expect(toActivity('check out')).toBe('check outing')
  })

  it('toEvent should handle multi-word inputs by transforming last word', () => {
    // Note: Multi-word strings are not recommended
    // Only the last word will be transformed
    expect(toEvent('check out')).toBe('check outed')
  })
})
