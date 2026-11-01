export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly errors?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    errors?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
};

async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const { body, headers: headersInit, ...init } = options;
  const headers = new Headers(headersInit);
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers,
      body: requestBody,
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      "We could not reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR",
    );
  }

  const text = await response.text();
  let payload: ApiEnvelope<T> | null = null;

  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const errorPayload = payload as
      | (Partial<ApiEnvelope<T>> & { code?: string; errors?: unknown })
      | null;

    throw new ApiError(
      errorPayload?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      errorPayload?.code,
      errorPayload?.errors,
    );
  }

  if (!payload) {
    throw new ApiError(
      "The server returned an empty response.",
      response.status,
      "EMPTY_RESPONSE",
    );
  }

  return payload;
}

export const api = {
  get: <T>(path: string, init?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(path, { ...init, method: "POST", body }),
  patch: <T>(
    path: string,
    body?: unknown,
    init?: Omit<RequestOptions, "body">,
  ) => apiRequest<T>(path, { ...init, method: "PATCH", body }),
  delete: <T>(path: string, init?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(path, { ...init, method: "DELETE" }),
};
