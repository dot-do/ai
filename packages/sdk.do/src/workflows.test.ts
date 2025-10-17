/**
 * Tests for Workflows System
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineWorkflow, createWorkflowsService, type WorkflowDefinition, type WorkflowExecution, type WorkflowExecutionStatus } from './workflows'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('Workflows', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('defineWorkflow', () => {
    it('should create a workflow with basic configuration', () => {
      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [
          {
            name: 'step1',
            function: 'test-function',
          },
        ],
      })

      expect(workflow.name).toBe('test-workflow')
      expect(workflow.definition.steps).toHaveLength(1)
      expect(workflow.definition.steps[0].name).toBe('step1')
    })

    it('should create a workflow with retry configuration', () => {
      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [
          {
            name: 'step1',
            function: 'test-function',
            retry: {
              max: 5,
              delay: 1000,
              backoff: 'exponential',
            },
          },
        ],
      })

      expect(workflow.definition.steps[0].retry).toEqual({
        max: 5,
        delay: 1000,
        backoff: 'exponential',
      })
    })

    it('should create a workflow with dependencies', () => {
      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [
          {
            name: 'step1',
            function: 'function1',
          },
          {
            name: 'step2',
            function: 'function2',
            dependsOn: ['step1'],
          },
          {
            name: 'step3',
            function: 'function3',
            dependsOn: ['step1', 'step2'],
          },
        ],
      })

      expect(workflow.definition.steps[1].dependsOn).toEqual(['step1'])
      expect(workflow.definition.steps[2].dependsOn).toEqual(['step1', 'step2'])
    })

    it('should create a workflow with parallel steps', () => {
      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [
          {
            name: 'extract',
            function: 'extract-data',
          },
          {
            name: 'transform',
            parallel: [
              {
                name: 'transform-customers',
                function: 'transform-customers',
              },
              {
                name: 'transform-orders',
                function: 'transform-orders',
              },
            ],
            dependsOn: ['extract'],
          },
        ],
      })

      expect(workflow.definition.steps[1].parallel).toHaveLength(2)
      expect(workflow.definition.steps[1].parallel?.[0].name).toBe('transform-customers')
    })

    it('should create a workflow with conditional branching', () => {
      const workflow = defineWorkflow({
        name: 'approval-workflow',
        steps: [
          {
            name: 'submit',
            function: 'submit-request',
          },
          {
            name: 'route',
            function: 'determine-approver',
            condition: {
              'amount > 10000': ['ceo-approval'],
              'amount > 1000': ['manager-approval'],
              default: ['auto-approve'],
            },
          },
        ],
      })

      expect(workflow.definition.steps[1].condition).toBeDefined()
      expect(workflow.definition.steps[1].condition?.['amount > 10000']).toEqual(['ceo-approval'])
    })
  })

  describe('Workflow.start', () => {
    it('should start workflow execution', async () => {
      const mockResponse = {
        id: 'exec-123',
        workflowName: 'test-workflow',
        status: 'running',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const execution = await workflow.start({ data: 'test' })

      expect(execution.id).toBe('exec-123')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://workflows.do/start/test-workflow',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ input: { data: 'test' }, metadata: undefined }),
        })
      )
    })

    it('should start workflow with metadata', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      await workflow.start({ data: 'test' }, { userId: 'user-123' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            input: { data: 'test' },
            metadata: { userId: 'user-123' },
          }),
        })
      )
    })

    it('should throw error on failed start', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      await expect(workflow.start({ data: 'test' })).rejects.toThrow('Failed to start workflow')
    })
  })

  describe('WorkflowExecution.status', () => {
    it('should get execution status', async () => {
      const mockStatus: WorkflowExecutionStatus = {
        id: 'exec-123',
        workflowName: 'test-workflow',
        status: 'running',
        progress: 0.5,
        completedSteps: ['step1'],
        failedSteps: [],
        startedAt: new Date().toISOString(),
        currentStep: 'step2',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const execution = await workflow.start({ data: 'test' })
      const status = await execution.status()

      expect(status.status).toBe('running')
      expect(status.progress).toBe(0.5)
      expect(status.completedSteps).toEqual(['step1'])
      expect(status.currentStep).toBe('step2')
    })
  })

  describe('WorkflowExecution.wait', () => {
    it('should wait for completion', async () => {
      const mockStatus: WorkflowExecutionStatus = {
        id: 'exec-123',
        workflowName: 'test-workflow',
        status: 'completed',
        progress: 1.0,
        completedSteps: ['step1', 'step2'],
        failedSteps: [],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        result: { success: true },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const execution = await workflow.start({ data: 'test' })
      const result = await execution.wait()

      expect(result.status).toBe('completed')
      expect(result.result).toEqual({ success: true })
    })

    it('should poll until completion', async () => {
      const runningStatus: WorkflowExecutionStatus = {
        id: 'exec-123',
        workflowName: 'test-workflow',
        status: 'running',
        progress: 0.5,
        completedSteps: ['step1'],
        failedSteps: [],
        startedAt: new Date().toISOString(),
      }

      const completedStatus: WorkflowExecutionStatus = {
        ...runningStatus,
        status: 'completed',
        progress: 1.0,
        completedSteps: ['step1', 'step2'],
        completedAt: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      // First poll: running
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => runningStatus,
      })

      // Second poll: completed
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => completedStatus,
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const execution = await workflow.start({ data: 'test' })
      const result = await execution.wait()

      expect(result.status).toBe('completed')
      expect(mockFetch).toHaveBeenCalledTimes(3) // start + 2 polls
    })

    it('should timeout after specified duration', async () => {
      const runningStatus: WorkflowExecutionStatus = {
        id: 'exec-123',
        workflowName: 'test-workflow',
        status: 'running',
        progress: 0.5,
        completedSteps: [],
        failedSteps: [],
        startedAt: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => runningStatus,
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const execution = await workflow.start({ data: 'test' })

      await expect(execution.wait(100)).rejects.toThrow('timed out')
    })
  })

  describe('WorkflowExecution.cancel', () => {
    it('should cancel execution', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const execution = await workflow.start({ data: 'test' })
      await execution.cancel()

      expect(mockFetch).toHaveBeenCalledWith('https://workflows.do/execution/exec-123/cancel', expect.objectContaining({ method: 'POST' }))
    })
  })

  describe('Workflow.executions', () => {
    it('should list executions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          executions: [{ id: 'exec-1' }, { id: 'exec-2' }],
        }),
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      const executions = await workflow.executions()

      expect(executions).toHaveLength(2)
      expect(executions[0].id).toBe('exec-1')
      expect(executions[1].id).toBe('exec-2')
    })

    it('should list executions with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ executions: [] }),
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      await workflow.executions({
        status: 'completed',
        limit: 10,
        offset: 5,
      })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('status=completed'), expect.objectContaining({ headers: expect.any(Object) }))
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'), expect.any(Object))
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('offset=5'), expect.any(Object))
    })
  })

  describe('Workflow.update', () => {
    it('should update workflow definition', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      await workflow.update({
        description: 'Updated description',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://workflows.do/test-workflow',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ description: 'Updated description' }),
        })
      )
    })
  })

  describe('Workflow.delete', () => {
    it('should delete workflow', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const workflow = defineWorkflow({
        name: 'test-workflow',
        steps: [{ name: 'step1', function: 'test-function' }],
      })

      await workflow.delete()

      expect(mockFetch).toHaveBeenCalledWith('https://workflows.do/test-workflow', expect.objectContaining({ method: 'DELETE' }))
    })
  })

  describe('WorkflowsService', () => {
    describe('define', () => {
      it('should define a new workflow', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })

        const service = createWorkflowsService()
        const workflow = await service.define({
          name: 'new-workflow',
          steps: [{ name: 'step1', function: 'test-function' }],
        })

        expect(workflow.name).toBe('new-workflow')
        expect(mockFetch).toHaveBeenCalledWith(
          'https://workflows.do/define',
          expect.objectContaining({
            method: 'POST',
          })
        )
      })
    })

    describe('get', () => {
      it('should get workflow by name', async () => {
        const mockDefinition: WorkflowDefinition = {
          name: 'test-workflow',
          steps: [{ name: 'step1', function: 'test-function' }],
        }

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockDefinition,
        })

        const service = createWorkflowsService()
        const workflow = await service.get('test-workflow')

        expect(workflow.name).toBe('test-workflow')
      })
    })

    describe('list', () => {
      it('should list all workflows', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            workflows: [
              { name: 'workflow-1', steps: [] },
              { name: 'workflow-2', steps: [] },
            ],
          }),
        })

        const service = createWorkflowsService()
        const workflows = await service.list()

        expect(workflows).toHaveLength(2)
        expect(workflows[0].name).toBe('workflow-1')
        expect(workflows[1].name).toBe('workflow-2')
      })

      it('should list workflows with options', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ workflows: [] }),
        })

        const service = createWorkflowsService()
        await service.list({
          limit: 10,
          offset: 5,
          namePattern: 'user-*',
        })

        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'), expect.any(Object))
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('offset=5'), expect.any(Object))
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('namePattern=user-'), expect.any(Object))
      })
    })

    describe('delete', () => {
      it('should delete workflow by name', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })

        const service = createWorkflowsService()
        await service.delete('test-workflow')

        expect(mockFetch).toHaveBeenCalledWith('https://workflows.do/test-workflow', expect.objectContaining({ method: 'DELETE' }))
      })
    })

    describe('execution', () => {
      it('should get execution by ID', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 'exec-123',
            workflowName: 'test-workflow',
            status: 'running',
          }),
        })

        const service = createWorkflowsService()
        const execution = await service.execution('exec-123')

        expect(execution.id).toBe('exec-123')
      })
    })

    describe('executions', () => {
      it('should list all executions', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            executions: [
              { id: 'exec-1', workflowName: 'workflow-1' },
              { id: 'exec-2', workflowName: 'workflow-2' },
            ],
          }),
        })

        const service = createWorkflowsService()
        const executions = await service.executions()

        expect(executions).toHaveLength(2)
        expect(executions[0].id).toBe('exec-1')
      })

      it('should list executions with filters', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ executions: [] }),
        })

        const service = createWorkflowsService()
        const startTime = new Date('2024-01-01')
        const endTime = new Date('2024-12-31')

        await service.executions({
          status: 'completed',
          limit: 20,
          startTime,
          endTime,
        })

        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('status=completed'), expect.any(Object))
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=20'), expect.any(Object))
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('startTime='), expect.any(Object))
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('endTime='), expect.any(Object))
      })
    })
  })

  describe('Authentication', () => {
    it('should include API key in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      const workflow = defineWorkflow(
        {
          name: 'test-workflow',
          steps: [{ name: 'step1', function: 'test-function' }],
        },
        {
          apiKey: 'test-api-key',
        }
      )

      await workflow.start({ data: 'test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      )
    })
  })

  describe('Custom API URL', () => {
    it('should use custom API URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'exec-123' }),
      })

      const workflow = defineWorkflow(
        {
          name: 'test-workflow',
          steps: [{ name: 'step1', function: 'test-function' }],
        },
        {
          apiUrl: 'https://custom.workflows.do',
        }
      )

      await workflow.start({ data: 'test' })

      expect(mockFetch).toHaveBeenCalledWith('https://custom.workflows.do/start/test-workflow', expect.any(Object))
    })
  })
})
