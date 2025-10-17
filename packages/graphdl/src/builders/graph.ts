import type { Graph, Node, Edge, GraphMetadata, Triple } from '../types/graph.js'

/**
 * Graph builder for creating semantic graphs
 */
export class GraphBuilder {
  private graph: Graph = {
    nodes: [],
    edges: [],
  }

  context(value: string | Record<string, any>): this {
    this.graph.$context = value
    return this
  }

  metadata(value: GraphMetadata): this {
    this.graph.metadata = value
    return this
  }

  node(node: Node): this {
    this.graph.nodes.push(node)
    return this
  }

  nodes(nodes: Node[]): this {
    this.graph.nodes.push(...nodes)
    return this
  }

  edge(edge: Edge): this {
    this.graph.edges.push(edge)
    return this
  }

  edges(edges: Edge[]): this {
    this.graph.edges.push(...edges)
    return this
  }

  /**
   * Add a triple as a node and edge
   */
  triple(triple: Triple): this {
    // Add subject as node if not exists
    if (!this.graph.nodes.find((n) => n.id === String(triple.subject))) {
      this.graph.nodes.push({
        id: String(triple.subject),
        type: 'Entity',
        properties: typeof triple.subject === 'object' ? triple.subject : {},
      })
    }

    // Add object as node if not exists
    if (typeof triple.object === 'object' && triple.object !== null) {
      const objectId = (triple.object as any).id || String(triple.object)
      if (!this.graph.nodes.find((n) => n.id === objectId)) {
        this.graph.nodes.push({
          id: objectId,
          type: 'Entity',
          properties: triple.object,
        })
      }
    }

    // Add edge
    this.graph.edges.push({
      source: String(triple.subject),
      target: typeof triple.object === 'object' ? (triple.object as any).id || String(triple.object) : String(triple.object),
      predicate: triple.predicate,
      properties: triple.metadata,
    })

    return this
  }

  /**
   * Add multiple triples
   */
  triples(triples: Triple[]): this {
    triples.forEach((t) => this.triple(t))
    return this
  }

  build(): Graph {
    return this.graph
  }

  /**
   * Export as JSON-LD with $ prefix
   */
  toJSONLD(): Record<string, any> {
    return {
      $context: this.graph.$context || 'https://schema.org',
      $graph: this.graph.nodes.map((node) => ({
        $id: node.id,
        $type: node.type,
        ...node.properties,
      })),
    }
  }
}

/**
 * Create a graph builder
 */
export function graph(): GraphBuilder {
  return new GraphBuilder()
}

/**
 * Create a node
 */
export function node(id: string, type: string | string[], properties?: Record<string, any>): Node {
  return {
    id,
    type,
    properties: properties || {},
  }
}

/**
 * Create an edge
 */
export function edge(source: string, predicate: string, target: string, properties?: Record<string, any>): Edge {
  return {
    source,
    target,
    predicate,
    properties,
  }
}
