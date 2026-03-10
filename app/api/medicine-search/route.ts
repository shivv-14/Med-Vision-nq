import { NextRequest, NextResponse } from 'next/server'

const EXTERNAL_API_URL = 'https://curo-156q.onrender.com/api/medicine-search'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query || query.trim() === '') {
    return NextResponse.json(
      { success: false, error: 'Search query is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${EXTERNAL_API_URL}?query=${encodeURIComponent(query.trim())}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers for the external API
          'Accept': 'application/json',
        },
        // Set a timeout to prevent hanging
        signal: AbortSignal.timeout(30000), // 30 second timeout
      }
    )

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Medicine service temporarily unavailable. Please try again later.',
            code: 'AUTH_ERROR'
          },
          { status: 503 }
        )
      }

      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: true, 
            data: { pharmEasy: { products: [] }, oneMg: { products: [] }, apollo: { products: [] } },
            message: 'No medicines found for this search.'
          },
          { status: 200 }
        )
      }

      throw new Error(`External API returned status ${response.status}`)
    }

    const data = await response.json()

    // Normalize the response
    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: 'Results fetched successfully'
    })

  } catch (error) {
    console.error('Medicine search API error:', error)

    // Handle timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unable to connect to pharmacy providers. Please try again.',
          code: 'TIMEOUT'
        },
        { status: 504 }
      )
    }

    // Handle network errors
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unable to connect to pharmacy providers. Please check your connection.',
          code: 'NETWORK_ERROR'
        },
        { status: 503 }
      )
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Medicine service temporarily unavailable. Please try again later.',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    )
  }
}
