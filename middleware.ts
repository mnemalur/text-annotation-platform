import { NextRequest } from "next/server"

// Temporarily disable all middleware checks
export function middleware(_req: NextRequest) {
  return null
}

export const config = {
  matcher: [] // Empty matcher means no paths will be processed by middleware
} 