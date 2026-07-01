import type { ApiErrorBody } from '@/types'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  const body = (await response.json().catch(() => null)) as T | ApiErrorBody | null

  if (!response.ok) {
    const error = body as ApiErrorBody | null
    throw new ApiError(
      error?.error ?? 'S’ha produït un error inesperat.',
      response.status,
      error?.code,
      error?.details,
    )
  }

  return body as T
}
