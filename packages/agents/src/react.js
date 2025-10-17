import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
export function AgentConfigComponent({ config, format = 'full' }) {
  return _jsxs('div', {
    className: 'agent-config',
    children: [
      _jsx('h1', { children: config.name }),
      config.version && _jsxs('div', { className: 'version', children: ['Version ', config.version] }),
      config.description &&
        _jsxs('section', { className: 'description', children: [_jsx('h2', { children: 'Description' }), _jsx('p', { children: config.description })] }),
      config.instructions &&
        _jsxs('section', { className: 'instructions', children: [_jsx('h2', { children: 'Instructions' }), _jsx('pre', { children: config.instructions })] }),
      config.rules &&
        config.rules.length > 0 &&
        _jsxs('section', { className: 'rules', children: [_jsx('h2', { children: 'Rules' }), _jsx(RuleList, { rules: config.rules })] }),
      config.capabilities &&
        config.capabilities.length > 0 &&
        _jsxs('section', {
          className: 'capabilities',
          children: [_jsx('h2', { children: 'Capabilities' }), _jsx('ul', { children: config.capabilities.map((cap, i) => _jsx('li', { children: cap }, i)) })],
        }),
      config.tools &&
        config.tools.length > 0 &&
        _jsxs('section', { className: 'tools', children: [_jsx('h2', { children: 'Tools' }), _jsx(ToolList, { tools: config.tools })] }),
      config.examples &&
        config.examples.length > 0 &&
        _jsxs('section', { className: 'examples', children: [_jsx('h2', { children: 'Examples' }), _jsx(ExampleList, { examples: config.examples })] }),
    ],
  })
}
export function RuleList({ rules }) {
  const grouped = groupBy(rules, (r) => r.category || 'general')
  return _jsx('div', {
    className: 'rule-list',
    children: Object.entries(grouped).map(([category, categoryRules]) =>
      _jsxs(
        'div',
        {
          className: 'rule-category',
          children: [
            _jsx('h3', { children: category }),
            _jsx('ul', {
              children: categoryRules.map((rule, i) => _jsx('li', { className: `priority-${rule.priority || 'medium'}`, children: rule.description }, i)),
            }),
          ],
        },
        category
      )
    ),
  })
}
export function ToolList({ tools }) {
  return _jsx('div', {
    className: 'tool-list',
    children: tools.map((tool, i) =>
      _jsxs(
        'div',
        {
          className: 'tool',
          children: [
            _jsx('h4', { children: tool.name }),
            _jsx('p', { children: tool.description }),
            tool.parameters &&
              _jsxs('details', {
                children: [_jsx('summary', { children: 'Parameters' }), _jsx('pre', { children: JSON.stringify(tool.parameters, null, 2) })],
              }),
          ],
        },
        i
      )
    ),
  })
}
export function ExampleList({ examples }) {
  return _jsx('div', {
    className: 'example-list',
    children: examples.map((example, i) =>
      _jsxs(
        'div',
        {
          className: 'example',
          children: [
            example.title && _jsx('h4', { children: example.title }),
            _jsxs('div', { className: 'example-input', children: [_jsx('strong', { children: 'Input:' }), _jsx('pre', { children: example.input })] }),
            _jsxs('div', { className: 'example-output', children: [_jsx('strong', { children: 'Output:' }), _jsx('pre', { children: example.output })] }),
            example.context && _jsx('div', { className: 'example-context', children: _jsx('em', { children: example.context }) }),
          ],
        },
        i
      )
    ),
  })
}
/**
 * Compact view for agent config card
 */
export function AgentCard({ config }) {
  return _jsxs('div', {
    className: 'agent-card',
    children: [
      _jsx('h3', { children: config.name }),
      config.description && _jsx('p', { className: 'description', children: config.description }),
      _jsxs('div', {
        className: 'meta',
        children: [
          config.model && _jsx('span', { className: 'model', children: config.model }),
          config.rules && _jsxs('span', { className: 'rule-count', children: [config.rules.length, ' rules'] }),
          config.capabilities && _jsxs('span', { className: 'capability-count', children: [config.capabilities.length, ' capabilities'] }),
        ],
      }),
    ],
  })
}
/**
 * Interactive editor component
 */
export function AgentEditor({ config, onChange }) {
  const updateField = (field, value) => {
    onChange({ ...config, [field]: value })
  }
  return _jsxs('div', {
    className: 'agent-editor',
    children: [
      _jsxs('div', {
        className: 'field',
        children: [
          _jsx('label', { children: 'Name' }),
          _jsx('input', { type: 'text', value: config.name, onChange: (e) => updateField('name', e.target.value) }),
        ],
      }),
      _jsxs('div', {
        className: 'field',
        children: [
          _jsx('label', { children: 'Description' }),
          _jsx('textarea', { value: config.description || '', onChange: (e) => updateField('description', e.target.value) }),
        ],
      }),
      _jsxs('div', {
        className: 'field',
        children: [
          _jsx('label', { children: 'Instructions' }),
          _jsx('textarea', { value: config.instructions || '', onChange: (e) => updateField('instructions', e.target.value), rows: 10 }),
        ],
      }),
      _jsxs('div', {
        className: 'field',
        children: [
          _jsx('label', { children: 'Model' }),
          _jsx('input', { type: 'text', value: config.model || '', onChange: (e) => updateField('model', e.target.value) }),
        ],
      }),
    ],
  })
}
// Utility function
function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}
//# sourceMappingURL=react.js.map
