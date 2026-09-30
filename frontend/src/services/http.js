const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

let accessToken = null;

export function configureAccessToken(token) {
  accessToken = token || null;
}

export async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const headers = { Accept: 'application/json' };

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = 'Bearer ' + accessToken;

  let response;
  try {
    response = await fetch(baseUrl + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Nao foi possivel conectar ao backend.');
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(payload?.message || payload?.erro || 'A requisicao nao pode ser concluida.');
  }
  return payload;
}

export function collectionOf(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.content || payload?.data || payload?.items || [];
}
