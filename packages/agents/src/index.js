/**
 * agents - Universal agent configuration format
 *
 * Parse, render, and manage agent configurations across multiple formats:
 * - agents.md
 * - .cursorrules (Cursor)
 * - CLAUDE.md (Claude)
 * - windsurf
 * - JSON
 */
export { parse, parseAgentsMd, parseClaudeMd, parseCursorRules, parseWindsurf, parseJson } from './parser'
export { render, renderAgentsMd, renderClaudeMd, renderCursorRules, renderWindsurf, renderJson } from './renderer'
//# sourceMappingURL=index.js.map
