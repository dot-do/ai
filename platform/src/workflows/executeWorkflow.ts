import { WorkflowConfig } from 'payload'

type WorkflowInput = {
  workflowId: string;
  input?: any;
  timeout?: number;
  memoryLimit?: number;
  eventId?: string;
};

type WorkflowOutput = {
  result: any | null;
  logs: string[];
  error?: string;
};

export const executeWorkflow: WorkflowConfig<any> = {
  slug: 'executeWorkflow',
  inputSchema: [
    { name: 'workflowId', type: 'text', required: true },
    { name: 'input', type: 'json' },
    { name: 'timeout', type: 'number' },
    { name: 'memoryLimit', type: 'number' },
    { name: 'eventId', type: 'text' },
  ],
  handler: async function({ job, tasks, req }) {
    const { payload } = req;
    
    const input = job.input as unknown as WorkflowInput;
    const { workflowId, timeout = 5000, memoryLimit = 128, eventId } = input;
    
    let event;
    try {
      if (eventId) {
        event = await payload.findByID({
          collection: 'events',
          id: eventId,
        });
        
        if (!event) {
          throw new Error(`Event with ID ${eventId} not found`);
        }
        
        await payload.update({
          collection: 'events',
          id: eventId,
          data: { status: 'Processing' }
        });
      } else {
        event = await payload.create({
          collection: 'events',
          data: {
            input: JSON.stringify(input.input),
            status: 'Processing',
            data: { workflowId }
          }
        });
      }
      
      const workflow = await payload.findByID({
        collection: 'workflows',
        id: workflowId,
      });
      
      if (!workflow) {
        const errorMessage = `Workflow with ID ${workflowId} not found`;
        
        await payload.update({
          collection: 'events',
          id: event.id,
          data: {
            status: 'Error',
            data: { error: errorMessage }
          }
        });
        
        const output = { 
          result: null,
          error: errorMessage,
          logs: [] 
        } as WorkflowOutput;
        
        await payload.update({
          collection: 'payload-jobs',
          id: job.id,
          data: {
            taskStatus: output,
            hasError: !!output.error,
            error: output.error
          }
        });
        
        return;
      }
      
      const ivm = await import('isolated-vm');
      const isolate = new ivm.Isolate({ memoryLimit });
      const context = await isolate.createContext();
      const logs: string[] = [];
      
      const mockApiObj = {
        get: async (path: string) => {
          logs.push(`API GET: ${path}`);
          return { success: true, message: 'Mock API response' };
        },
        post: async (path: string, data: any) => {
          logs.push(`API POST: ${path} with data: ${JSON.stringify(data)}`);
          return { success: true, message: 'Mock API response' };
        },
      };

      const mockAiObj = {
        generate: async (prompt: string) => {
          logs.push(`AI generate: ${prompt}`);
          return { text: 'Mock AI response' };
        },
        generateIdeas: async (params: any) => {
          logs.push(`AI generateIdeas: ${JSON.stringify(params)}`);
          return { ideas: ['Mock idea 1', 'Mock idea 2'] };
        },
      };

      const mockDbObj = {
        query: async (query: string) => {
          logs.push(`DB query: ${query}`);
          return { results: [] };
        },
        ideas: {
          findSimilar: async (params: any) => {
            logs.push(`DB ideas.findSimilar: ${JSON.stringify(params)}`);
            return [];
          },
          create: async (params: any) => {
            logs.push(`DB ideas.create: ${JSON.stringify(params)}`);
            return { id: 'mock-id', ...params };
          },
        },
      };

      const mockApiRef = new ivm.Reference(mockApiObj);
      const mockAiRef = new ivm.Reference(mockAiObj);
      const mockDbRef = new ivm.Reference(mockDbObj);

      await context.global.set('api', mockApiRef);
      await context.global.set('ai', mockAiRef);
      await context.global.set('db', mockDbRef);
      await context.global.set('event', new ivm.Reference({ data: input.input }));

      await context.global.set(
        'console',
        new ivm.Reference({
          log: (...args: any[]) => {
            const logMessage = args.map((arg) => 
              (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
            ).join(' ');
            logs.push(logMessage);
          },
        }),
      );

      const script = await isolate.compileScript(`
        (function() {
          try {
            ${workflow.code}
          } catch (error) {
            throw new Error(error.message || String(error));
          }
        })()
      `);

      let result = null;
      try {
        result = await script.run(context, { timeout });
        
        await payload.update({
          collection: 'events',
          id: event.id,
          data: {
            status: 'Success',
            data: {
              result,
              logs
            }
          }
        });
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        await payload.update({
          collection: 'events',
          id: event.id,
          data: {
            status: 'Error',
            data: { 
              error: errorMessage,
              logs
            }
          }
        });
        
        const output = {
          result: null,
          error: errorMessage,
          logs,
        } as WorkflowOutput;
        
        await payload.update({
          collection: 'payload-jobs',
          id: job.id,
          data: {
            taskStatus: output,
            hasError: !!output.error,
            error: output.error
          }
        });
        
        return;
      } finally {
        context.release();
        isolate.dispose();
      }

      const output = {
        result,
        error: undefined,
        logs,
      } as WorkflowOutput;
      
      await payload.update({
        collection: 'payload-jobs',
        id: job.id,
        data: {
          taskStatus: output,
          hasError: !!output.error,
          error: output.error,
          completedAt: new Date().toISOString()
        }
      });
      
      return;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (event) {
        await payload.update({
          collection: 'events',
          id: event.id,
          data: {
            status: 'Error',
            data: { 
              error: errorMessage,
              stack: error.stack
            }
          }
        });
      }
      
      const output = {
        result: null,
        error: errorMessage,
        logs: [],
      } as WorkflowOutput;
      
      await payload.update({
        collection: 'payload-jobs',
        id: job.id,
        data: {
          taskStatus: output,
          hasError: !!output.error,
          error: output.error,
          completedAt: new Date().toISOString()
        }
      });
      
      return;
    }
  },
}
