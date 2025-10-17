import { NextRequest, NextResponse } from 'next/server'
import { DirectoryDataSource } from '../../../src/data-source'
import { loadDirectoryConfig } from '../../../src/config-loader'

let dataSource: DirectoryDataSource | null = null

async function getDataSource() {
  if (!dataSource) {
    const config = await loadDirectoryConfig()
    dataSource = new DirectoryDataSource(config)
    await dataSource.initialize()
  }
  return dataSource
}

/**
 * GET handler for retrieving directory items
 * Supports both collection listing and single item retrieval
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const ds = await getDataSource()
  const resolvedParams = await params
  const path = resolvedParams.path || []

  if (path.length === 1 && path[0] !== 'categories') {
    const id = path[0]
    const item = await ds.getItem(id)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  }

  if (path.length === 1 && path[0] === 'categories') {
    const categories = await ds.getCategories()
    return NextResponse.json({ categories })
  }

  const url = new URL(request.url)
  const searchParams = url.searchParams

  const query = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  }

  const result = await ds.getItems(query)
  return NextResponse.json(result)
}

/**
 * POST handler for creating new items (if supported by data source)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const ds = await getDataSource()
    const body = await request.json()

    return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
  } catch (error) {
    console.error('Error in POST handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH handler for updating items (if supported by data source)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const ds = await getDataSource()
    const resolvedParams = await params
    const path = resolvedParams.path || []

    if (path.length !== 1) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const id = path[0]
    const body = await request.json()

    return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
  } catch (error) {
    console.error('Error in PATCH handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE handler for removing items (if supported by data source)
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const ds = await getDataSource()
    const resolvedParams = await params
    const path = resolvedParams.path || []

    if (path.length !== 1) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const id = path[0]

    return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
  } catch (error) {
    console.error('Error in DELETE handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
