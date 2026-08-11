import httpClient from '../../shared/lib/httpClient';

export async function loginApi(credentials) {
  const response = await httpClient.post('/auth/login', credentials);
  return response.data;
}
