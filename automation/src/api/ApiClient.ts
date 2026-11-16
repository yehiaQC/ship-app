import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

/**
 * Thin wrapper around Playwright's APIRequestContext.
 * Use it in API tests, and in UI tests to create/clean up data quickly
 * (faster and more reliable than doing setup through the UI).
 */
export class ApiClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  setToken(token: string | undefined): void {
    this.token = token;
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return { ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...extra };
  }

  get(url: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(url, { headers: this.headers(), params });
  }
  post(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.post(url, { headers: this.headers(), data });
  }
  put(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.put(url, { headers: this.headers(), data });
  }
  patch(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.patch(url, { headers: this.headers(), data });
  }
  delete(url: string): Promise<APIResponse> {
    return this.request.delete(url, { headers: this.headers() });
  }

  /** Assert status and return parsed JSON, with the body in the failure message. */
  static async json<T = any>(res: APIResponse, expectedStatus: number): Promise<T> {
    const body = await res.text();
    expect(res.status(), `Unexpected status for ${res.url()}: ${body.slice(0, 500)}`).toBe(expectedStatus);
    return (body ? JSON.parse(body) : undefined) as T;
  }
}
