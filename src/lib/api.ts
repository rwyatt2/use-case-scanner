/**
 * Centralized API client — timeout, error handling, and consistent response shape.
 * Enterprise: no credentials in client; use env or auth layer in front of API.
 */

import { API_BASE, API_TIMEOUT_MS } from '@/constants'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = API_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    clearTimeout(id)
    return res
  } catch (err) {
    clearTimeout(id)
    if (err instanceof Error) {
      if (err.name === 'AbortError') throw new ApiError('Request timed out')
      throw new ApiError(err.message)
    }
    throw new ApiError('Network error')
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = await res.text()
    }
    throw new ApiError(res.statusText || 'Request failed', res.status, body)
  }
  return res.json() as Promise<T>
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const search = params ? '?' + new URLSearchParams(params).toString() : ''
  const url = `${API_BASE}${path}${search}`
  const res = await fetchWithTimeout(url)
  if (!res.ok) {
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = await res.text()
    }
    throw new ApiError(res.statusText || 'Request failed', res.status, body)
  }
  return res.json() as Promise<T>
}
