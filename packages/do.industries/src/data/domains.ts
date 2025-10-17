import type { Domain } from '../types/index.js'

/**
 * All .do domains with their categories and descriptions
 * Source: .domains.tsv
 */
export const DOMAINS: Domain[] = [
  { domain: 'functions.do', category: 'Function', description: 'Typesafe, composable business logic and automation' },
  { domain: 'database.do', category: 'Data Layer', description: 'AI-native data access (search, CRUD, resources)' },
  { domain: 'workflows.do', category: 'Workflow', description: 'Declarative orchestration of business processes' },
  { domain: 'agents.do', category: 'Agent', description: 'Platform for deploying/managing autonomous digital workers' },
  { domain: 'llm.do', category: 'Gateway', description: 'Unified gateway for large language models (LLMs)' },
  { domain: 'nouns.do', category: 'Data Model', description: 'Types of entities: people, places, things, ideas' },
  { domain: 'verbs.do', category: 'Data Model', description: 'Actions performed by or to nouns' },
  { domain: 'resources.do', category: 'Data Model', description: 'Structured data records (instances of nouns)' },
  { domain: 'triggers.do', category: 'Event/Trigger', description: 'Initiate workflows based on business or system events' },
  { domain: 'searches.do', category: 'Query/Search', description: 'Query and retrieve structured or unstructured data' },
  { domain: 'actions.do', category: 'Action', description: 'Perform tasks and operations within workflows' },
  { domain: 'evals.do', category: 'Evaluation', description: 'Evaluate performance of functions, workflows, and agents' },
  { domain: 'analytics.do', category: 'Analytics', description: 'Measure and validate workflow/business outcomes' },
  { domain: 'experiments.do', category: 'Experimentation', description: 'Test and iterate functions, workflows, and agents' },
  { domain: 'integrations.do', category: 'Integration', description: 'Connect external APIs and systems to business processes' },
  { domain: 'models.do', category: 'Model Management', description: 'Select and manage AI/ML models' },
  { domain: 'apis.do', category: 'API Gateway', description: 'Unified API gateway for all services' },
  { domain: 'studio.do', category: 'CMS/Admin UI', description: 'Custom-branded Payload CMS for admin and content' },
  { domain: 'databases.do', category: 'Data Layer', description: 'Collections of data resources (see database.do)' },
  { domain: 'okrs.do', category: 'Business Goal', description: 'Objectives and Key Results (OKR) management' },
  { domain: 'llms.do', category: 'Gateway', description: 'Collection of large language models (see llm.do)' },
  { domain: 'do.com.ai', category: 'Platform/Brand', description: 'AI Primitives platform (business-as-code)' },
  { domain: 'action.do', category: 'Action', description: 'Atomic action in workflows or automation' },
  { domain: 'agi.do', category: 'Agent', description: 'Autonomous General Intelligence agent' },
  { domain: 'amy.do', category: 'Agent', description: 'Autonomous digital worker named Amy' },
  { domain: 'ari.do', category: 'Agent', description: 'Autonomous digital worker named Ari' },
  { domain: 'barcode.do', category: 'Utility', description: 'Barcode generation and recognition' },
  { domain: 'bdr.do', category: 'Agent', description: 'Autonomous digital BDR' },
  { domain: 'benchmarks.do', category: 'Experimentation', description: 'Benchmarks for evaluating models, workflows, or agents' },
  { domain: 'blogs.do', category: 'Content/Resource', description: 'Blog content and publishing platform' },
  { domain: 'bots.do', category: 'Agent', description: 'Autonomous digital worker (bot/agent)' },
  { domain: 'browse.do', category: 'Utility', description: 'Browsing and web navigation automation' },
  { domain: 'browser.do', category: 'Utility', description: 'Web browser automation and control' },
  { domain: 'browsers.do', category: 'Utility', description: 'Collection of browser agents/utilities' },
  { domain: 'careers.do', category: 'Content/Resource', description: 'Careers and jobs portal' },
  { domain: 'cfo.do', category: 'Agent', description: 'Autonomous digital Chief Financial Officer (CFO)' },
  { domain: 'clickhouse.do', category: 'Data/Infra', description: 'Cloud-native analytical database' },
  { domain: 'cmo.do', category: 'Agent', description: 'Autonomous digital Chief Marketing Officer (CMO)' },
  { domain: 'coach.do', category: 'Agent', description: 'Autonomous digital Coach' },
  { domain: 'colo.do', category: 'Infra/Utility', description: 'Colocation and infrastructure services' },
  { domain: 'context.do', category: 'Utility', description: 'Context management and enrichment' },
  { domain: 'coo.do', category: 'Agent', description: 'Autonomous digital Chief Operating Officer (COO)' },
  { domain: 'cpo.do', category: 'Agent', description: 'Autonomous digital Chief Product Officer (CPO)' },
  { domain: 'cro.do', category: 'Agent', description: 'Autonomous digital Chief Revenue Officer (CRO)' },
  { domain: 'cto.do', category: 'Agent', description: 'Autonomous digital Chief Technology Officer (CTO)' },
  { domain: 'ctx.do', category: 'Utility', description: 'Contextual data or services' },
  { domain: 'dara.do', category: 'Agent', description: 'Autonomous digital worker named Dara' },
  { domain: 'dash.do', category: 'Utility', description: 'Dashboards and data visualization' },
  { domain: 'dashboard.do', category: 'Utility', description: 'Dashboard and analytics interface' },
  { domain: 'emails.do', category: 'Utility', description: 'Email sending and management' },
  { domain: 'embeddings.do', category: 'Utility', description: 'Vector embeddings for search and retrieval' },
  { domain: 'esbuild.do', category: 'Dev Tool', description: 'JavaScript bundler and build tool' },
  { domain: 'events.do', category: 'Event/Trigger', description: 'Business or system event tracking' },
  { domain: 'extract.do', category: 'Utility', description: 'Data extraction and transformation' },
  { domain: 'function.do', category: 'Function', description: 'Atomic/composable function (see functions.do)' },
  { domain: 'gpt.do', category: 'Model Management', description: 'OpenAI GPT model integrations' },
  { domain: 'graph.do', category: 'Data/Utility', description: 'Graph data and relationships' },
  { domain: 'humans.do', category: 'Human', description: 'Human worker management and assignment' },
  { domain: 'issues.do', category: 'Utility', description: 'Issue and bug tracking' },
  { domain: 'ivy.do', category: 'Agent', description: 'Autonomous digital worker named Ivy' },
  { domain: 'kpis.do', category: 'Business Metric', description: 'Key Performance Indicators (KPIs)' },
  { domain: 'lena.do', category: 'Agent', description: 'Autonomous digital worker named Lena' },
  { domain: 'lexi.do', category: 'Agent', description: 'Autonomous digital worker named Lexi' },
  { domain: 'lists.do', category: 'Utility', description: 'List management and operations' },
  { domain: 'lodash.do', category: 'Dev Tool', description: 'JavaScript utility library' },
  { domain: 'mcp.do', category: 'Agent', description: 'Autonomous digital Master Control Program (MCP)' },
  { domain: 'mdx.do', category: 'Content/Resource', description: 'Markdown + JSX content (MDX)' },
  { domain: 'nat.do', category: 'Agent', description: 'Autonomous digital worker named Nat' },
  { domain: 'nats.do', category: 'Infra/Utility', description: 'NATS messaging and streaming' },
  { domain: 'oauth.do', category: 'Security/Auth', description: 'OAuth authentication and authorization' },
  { domain: 'objects.do', category: 'Data Model', description: 'Generic data objects and records' },
  { domain: 'payload.do', category: 'Admin UI', description: 'Payload CMS integration' },
  { domain: 'pdm.do', category: 'Agent', description: 'Autonomous digital Product Data Management (PDM)' },
  { domain: 'perf.do', category: 'Analytics', description: 'Performance monitoring and analytics' },
  { domain: 'photos.do', category: 'Content/Resource', description: 'Photo storage and management' },
  { domain: 'pkg.do', category: 'Dev Tool', description: 'Package management and utilities' },
  { domain: 'programmers.do', category: 'Agent', description: 'Autonomous digital Programmer' },
  { domain: 'qrcode.do', category: 'Utility', description: 'QR code generation and scanning' },
  { domain: 'queue.do', category: 'Utility', description: 'Task and job queue management' },
  { domain: 'repo.do', category: 'Dev Tool', description: 'Repository management and code hosting' },
  { domain: 'requests.do', category: 'Utility', description: 'HTTP/API request management' },
  { domain: 'research.do', category: 'Utility', description: 'Research and information retrieval' },
  { domain: 'responses.do', category: 'Utility', description: 'Response formatting and handling' },
  { domain: 'scraper.do', category: 'Utility', description: 'Web scraping and data extraction' },
  { domain: 'sdk.do', category: 'Dev Tool', description: 'Software Development Kit (SDK)' },
  { domain: 'sdr.do', category: 'Agent', description: 'Autonomous digital Sales Development Representative (SDR)' },
  { domain: 'services.do', category: 'Utility', description: 'Service registry and management' },
  { domain: 'sites.do', category: 'Content/Resource', description: 'Website and landing page management' },
  { domain: 'speak.do', category: 'Utility', description: 'Speech synthesis and recognition' },
  { domain: 'state.do', category: 'Utility', description: 'State management and persistence' },
  { domain: 'svc.do', category: 'Utility', description: 'Service abstraction and orchestration' },
  { domain: 'swe.do', category: 'Agent', description: 'Autonomous digital Software Engineer (SWE)' },
  { domain: 'tasks.do', category: 'Utility', description: 'Task management and assignment' },
  { domain: 'tom.do', category: 'Agent', description: 'Autonomous digital worker named Tom' },
  { domain: 'trace.do', category: 'Analytics', description: 'Tracing and observability' },
  { domain: 'traces.do', category: 'Analytics', description: 'Trace collection and analysis' },
  { domain: 'trigger.do', category: 'Event/Trigger', description: 'Trigger for workflows or actions' },
  { domain: 'vectors.do', category: 'Utility', description: 'Vector database and search' },
  { domain: 'vehicle.do', category: 'Content/Resource', description: 'Vehicle data and management' },
  { domain: 'vera.do', category: 'Agent', description: 'Autonomous digital worker named Vera' },
  { domain: 'waitlist.do', category: 'Utility', description: 'Waitlist and signup management' },
  { domain: 'webhook.do', category: 'Utility', description: 'Webhook event receiver/sender' },
  { domain: 'webhooks.do', category: 'Utility', description: 'Webhook management and automation' },
  { domain: 'worker.do', category: 'Agent', description: 'Autonomous digital Worker' },
  { domain: 'workers.do', category: 'Agent', description: 'Collection of autonomous digital workers' },
]

/**
 * Domain lookup by name
 */
export const DOMAIN_MAP = new Map(DOMAINS.map((d) => [d.domain, d]))

/**
 * Domains grouped by category
 */
export const DOMAINS_BY_CATEGORY = DOMAINS.reduce(
  (acc, domain) => {
    if (!acc[domain.category]) {
      acc[domain.category] = []
    }
    acc[domain.category].push(domain)
    return acc
  },
  {} as Record<string, Domain[]>
)

/**
 * All unique categories
 */
export const CATEGORIES = Array.from(new Set(DOMAINS.map((d) => d.category)))
