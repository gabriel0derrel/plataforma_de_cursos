const baseUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

let accessToken: string | null = null;

export function configureAccessToken(token: string | null): void {
  accessToken = token;
}

export async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const { method = 'GET', body } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new Error(`Não foi possível conectar à API em ${baseUrl}. Verifique EXPO_PUBLIC_API_URL.`);
  }

  const contentType = response.headers.get('content-type') || '';
  const payload: unknown = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'message' in payload ? (payload as { message?: string | string[] }).message : undefined;
    throw new Error(Array.isArray(message) ? message.join('\n') : message || 'A requisição não pôde ser concluída.');
  }
  return payload as T;
}
