/**
 * Creates a cartesian product of the provided specification object.
 *
 * @example
 * ```
 * cartesian({ a: [1, 2], b: ['x', 'y'] })
 * // Returns: [
 * //   { a: 1, b: 'x' },
 * //   { a: 1, b: 'y' },
 * //   { a: 2, b: 'x' },
 * //   { a: 2, b: 'y' }
 * // ]
 * ```
 */
export function cartesian<T extends Record<string, readonly any[]>>(spec: T): Array<{ [K in keyof T]: T[K][number] }> {
  const keys = Object.keys(spec) as Array<keyof T>
  if (keys.length === 0) return [] as Array<{ [K in keyof T]: T[K][number] }>
  return keys.reduce<Array<Record<string, any>>>(
    (acc, key) => {
      const values = spec[key]
      return acc.flatMap((combo) => values.map((value) => ({ ...combo, [key]: value })))
    },
    [{}]
  ) as Array<{ [K in keyof T]: T[K][number] }>
}
