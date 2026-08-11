import httpClient from '../../../utility/http/httpClient';

export async function fetchRetentionList(filters = {}) {
  try {
    const response = await httpClient.get('/drh/retention-list', { params: filters });
    return response.data || [];
  } catch (err) {
    return [];
  }
}

export async function exportRetentionReport(filters = {}) {
  return httpClient.get('/drh/export', { params: filters, responseType: 'blob' });
}
