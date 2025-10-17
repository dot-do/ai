import { describe, it, expect } from 'vitest'
import {
  type Integration,
  type IntegrationTrigger,
  type IntegrationSearch,
  type IntegrationAction,
  type IntegrationField,
  type ONetTool,
  isIntegration,
  isIntegrationTrigger,
  isIntegrationSearch,
  isIntegrationAction,
} from './integrations.js'

describe('Integration Types', () => {
  describe('IntegrationField', () => {
    it('should create a valid field', () => {
      const field: IntegrationField = {
        key: 'email',
        label: 'Email Address',
        type: 'string',
        required: true,
        description: 'The email address to send to',
      }

      expect(field.key).toBe('email')
      expect(field.required).toBe(true)
    })

    it('should support optional fields', () => {
      const field: IntegrationField = {
        key: 'cc',
        label: 'CC',
        type: 'string',
        required: false,
        default: '',
        choices: ['user1@example.com', 'user2@example.com'],
      }

      expect(field.required).toBe(false)
      expect(field.choices).toHaveLength(2)
    })
  })

  describe('IntegrationTrigger', () => {
    it('should create a valid trigger', () => {
      const trigger: IntegrationTrigger = {
        $type: 'Trigger',
        $id: 'zapier:gmail:new-email',
        key: 'new_email',
        name: 'New Email',
        description: 'Triggers when a new email arrives',
        inputFields: [
          {
            key: 'label',
            label: 'Label',
            type: 'string',
            required: false,
          },
        ],
        outputFields: [
          {
            key: 'subject',
            label: 'Subject',
            type: 'string',
            required: true,
          },
          {
            key: 'from',
            label: 'From',
            type: 'string',
            required: true,
          },
        ],
        polling: true,
        webhook: false,
      }

      expect(trigger.$type).toBe('Trigger')
      expect(trigger.polling).toBe(true)
      expect(trigger.inputFields).toHaveLength(1)
      expect(trigger.outputFields).toHaveLength(2)
    })

    it('should support webhook triggers', () => {
      const trigger: IntegrationTrigger = {
        $type: 'Trigger',
        $id: 'zapier:stripe:payment-succeeded',
        key: 'payment_succeeded',
        name: 'Payment Succeeded',
        description: 'Triggers when a payment is successful',
        inputFields: [],
        outputFields: [
          {
            key: 'amount',
            label: 'Amount',
            type: 'number',
            required: true,
          },
        ],
        polling: false,
        webhook: true,
      }

      expect(trigger.webhook).toBe(true)
      expect(trigger.polling).toBe(false)
    })
  })

  describe('IntegrationSearch', () => {
    it('should create a valid search', () => {
      const search: IntegrationSearch = {
        $type: 'Search',
        $id: 'zapier:gmail:find-email',
        key: 'find_email',
        name: 'Find Email',
        description: 'Finds an email by subject or sender',
        inputFields: [
          {
            key: 'subject',
            label: 'Subject',
            type: 'string',
            required: false,
          },
          {
            key: 'from',
            label: 'From',
            type: 'string',
            required: false,
          },
        ],
        outputFields: [
          {
            key: 'email',
            label: 'Email',
            type: 'object',
            required: true,
          },
        ],
      }

      expect(search.$type).toBe('Search')
      expect(search.inputFields).toHaveLength(2)
      expect(search.outputFields).toHaveLength(1)
    })
  })

  describe('IntegrationAction', () => {
    it('should create a valid action', () => {
      const action: IntegrationAction = {
        $type: 'Action',
        $id: 'zapier:slack:post-message',
        key: 'post_message',
        name: 'Post Message',
        description: 'Posts a message to a Slack channel',
        inputFields: [
          {
            key: 'channel',
            label: 'Channel',
            type: 'string',
            required: true,
          },
          {
            key: 'text',
            label: 'Message Text',
            type: 'string',
            required: true,
          },
        ],
        outputFields: [
          {
            key: 'message_id',
            label: 'Message ID',
            type: 'string',
            required: true,
          },
        ],
      }

      expect(action.$type).toBe('Action')
      expect(action.inputFields).toHaveLength(2)
      expect(action.outputFields).toHaveLength(1)
    })
  })

  describe('Integration', () => {
    it('should create a valid integration', () => {
      const integration: Integration = {
        $type: 'Integration',
        $id: 'zapier:gmail',
        key: 'gmail',
        name: 'Gmail',
        description: "Google's email service",
        platform: 'zapier',
        category: 'Email',
        triggers: [
          {
            $type: 'Trigger',
            $id: 'zapier:gmail:new-email',
            key: 'new_email',
            name: 'New Email',
            description: 'Triggers when a new email arrives',
            inputFields: [],
            outputFields: [],
          },
        ],
        searches: [
          {
            $type: 'Search',
            $id: 'zapier:gmail:find-email',
            key: 'find_email',
            name: 'Find Email',
            description: 'Finds an email',
            inputFields: [],
            outputFields: [],
          },
        ],
        actions: [
          {
            $type: 'Action',
            $id: 'zapier:gmail:send-email',
            key: 'send_email',
            name: 'Send Email',
            description: 'Sends an email',
            inputFields: [],
            outputFields: [],
          },
        ],
      }

      expect(integration.$type).toBe('Integration')
      expect(integration.platform).toBe('zapier')
      expect(integration.triggers).toHaveLength(1)
      expect(integration.searches).toHaveLength(1)
      expect(integration.actions).toHaveLength(1)
    })

    it('should support n8n platform', () => {
      const integration: Integration = {
        $type: 'Integration',
        $id: 'n8n:http',
        key: 'http',
        name: 'HTTP Request',
        description: 'Makes HTTP requests',
        platform: 'n8n',
        category: 'Core',
        triggers: [],
        searches: [],
        actions: [
          {
            $type: 'Action',
            $id: 'n8n:http:request',
            key: 'request',
            name: 'Request',
            description: 'Make an HTTP request',
            inputFields: [],
            outputFields: [],
          },
        ],
      }

      expect(integration.platform).toBe('n8n')
    })

    it('should support onet platform', () => {
      const integration: Integration = {
        $type: 'Integration',
        $id: 'onet:tool:git',
        key: 'git',
        name: 'Git',
        description: 'Version control system',
        platform: 'onet',
        category: 'Software',
        triggers: [],
        searches: [],
        actions: [],
      }

      expect(integration.platform).toBe('onet')
    })
  })

  describe('ONetTool', () => {
    it('should create a valid O*NET tool', () => {
      const tool: ONetTool = {
        $type: 'ONetTool',
        $id: 'onet:tool:git',
        name: 'Git',
        description: 'Distributed version control system',
        category: 'software',
        occupations: ['15-1252.00'], // Software Developers
        vendor: 'Git SCM',
      }

      expect(tool.$type).toBe('ONetTool')
      expect(tool.category).toBe('software')
      expect(tool.occupations).toHaveLength(1)
    })

    it('should support multiple occupations', () => {
      const tool: ONetTool = {
        $type: 'ONetTool',
        $id: 'onet:tool:python',
        name: 'Python',
        description: 'Programming language',
        category: 'technology',
        occupations: ['15-1252.00', '15-2051.00'], // Software Developers, Data Scientists
      }

      expect(tool.occupations).toHaveLength(2)
    })
  })

  describe('Type Guards', () => {
    it('should identify Integration', () => {
      const integration: Integration = {
        $type: 'Integration',
        $id: 'test',
        key: 'test',
        name: 'Test',
        description: 'Test integration',
        platform: 'zapier',
        category: 'Test',
        triggers: [],
        searches: [],
        actions: [],
      }

      expect(isIntegration(integration)).toBe(true)
      expect(isIntegrationTrigger(integration)).toBe(false)
    })

    it('should identify IntegrationTrigger', () => {
      const trigger: IntegrationTrigger = {
        $type: 'Trigger',
        $id: 'test',
        key: 'test',
        name: 'Test',
        description: 'Test trigger',
        inputFields: [],
        outputFields: [],
      }

      expect(isIntegrationTrigger(trigger)).toBe(true)
      expect(isIntegration(trigger)).toBe(false)
    })

    it('should identify IntegrationSearch', () => {
      const search: IntegrationSearch = {
        $type: 'Search',
        $id: 'test',
        key: 'test',
        name: 'Test',
        description: 'Test search',
        inputFields: [],
        outputFields: [],
      }

      expect(isIntegrationSearch(search)).toBe(true)
      expect(isIntegrationAction(search)).toBe(false)
    })

    it('should identify IntegrationAction', () => {
      const action: IntegrationAction = {
        $type: 'Action',
        $id: 'test',
        key: 'test',
        name: 'Test',
        description: 'Test action',
        inputFields: [],
        outputFields: [],
      }

      expect(isIntegrationAction(action)).toBe(true)
      expect(isIntegrationSearch(action)).toBe(false)
    })

    it('should reject invalid objects', () => {
      expect(isIntegration({})).toBe(false)
      expect(isIntegration(null)).toBe(false)
      expect(isIntegration(undefined)).toBe(false)
      expect(isIntegration('test')).toBe(false)
    })
  })

  describe('Semantic Path Patterns', () => {
    it('should follow $.Subject.predicate.Object pattern', () => {
      const paths = [
        '$.Gmail.triggers.newEmail',
        '$.Slack.searches.findUser',
        '$.Stripe.actions.createCharge',
        '$.n8n.HTTP.actions.request',
        '$.SoftwareDeveloper.usesTool.Git',
      ]

      paths.forEach((path) => {
        expect(path).toMatch(/^\$\.\w+\.(triggers|searches|actions|usesTool|usesTechnology|usesSoftware)\.\w+$/)
      })
    })
  })
})
