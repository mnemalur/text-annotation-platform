export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: any[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      error: error.message,
      errors: error.errors,
      status: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500,
    }
  }

  return {
    error: 'An unexpected error occurred',
    status: 500,
  }
} 