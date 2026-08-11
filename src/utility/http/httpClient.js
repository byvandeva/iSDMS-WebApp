import { apiConfig } from '../../configs/apiConfig';

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getAuthHeader() {
  const token = localStorage.getItem('sdms_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestWithBackoff(url, options, retriesLeft = apiConfig.retryCount, backoffDelay = apiConfig.retryDelay) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...(options.headers || {}),
      },
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (res.status >= 500 && retriesLeft > 0) {
        await new Promise((r) => setTimeout(r, backoffDelay));
        return requestWithBackoff(url, options, retriesLeft - 1, backoffDelay * 2);
      }
      throw new ApiError(res.status, res.statusText || 'Gagal memproses request ke SDMS', errorData);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return { data, status: res.status };
    }

    const textData = await res.text();
    return { data: textData, status: res.status };
  } catch (err) {
    clearTimeout(timer);

    if (err.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout: Server SDMS tidak merespons dalam 10 detik');
    }

    if (err instanceof ApiError) {
      throw err;
    }

    if (retriesLeft > 0) {
      await new Promise((r) => setTimeout(r, backoffDelay));
      return requestWithBackoff(url, options, retriesLeft - 1, backoffDelay * 2);
    }

    throw new ApiError(0, 'Koneksi gagal: Tidak dapat terhubung ke server SDMS', err);
  }
}

export const httpClient = {
  get(endpoint, options = {}) {
    const fullUrl = `${apiConfig.baseUrl}${endpoint}`;
    return requestWithBackoff(fullUrl, { method: 'GET', ...options });
  },

  post(endpoint, body, options = {}) {
    const fullUrl = `${apiConfig.baseUrl}${endpoint}`;
    return requestWithBackoff(fullUrl, { method: 'POST', body: JSON.stringify(body), ...options });
  },

  put(endpoint, body, options = {}) {
    const fullUrl = `${apiConfig.baseUrl}${endpoint}`;
    return requestWithBackoff(fullUrl, { method: 'PUT', body: JSON.stringify(body), ...options });
  },

  patch(endpoint, body, options = {}) {
    const fullUrl = `${apiConfig.baseUrl}${endpoint}`;
    return requestWithBackoff(fullUrl, { method: 'PATCH', body: JSON.stringify(body), ...options });
  },

  delete(endpoint, options = {}) {
    const fullUrl = `${apiConfig.baseUrl}${endpoint}`;
    return requestWithBackoff(fullUrl, { method: 'DELETE', ...options });
  },
};

export default httpClient;
