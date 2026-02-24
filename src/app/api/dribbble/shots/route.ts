import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createDribbbleClient } from '@/lib/dribbble'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '12')

    const client = createDribbbleClient(session.accessToken)
    const shots = await client.getUserShots({ page, per_page: perPage })

    return NextResponse.json(shots)
  } catch (error) {
    console.error('Error fetching shots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shots' },
      { status: 500 }
    )
  }
}
