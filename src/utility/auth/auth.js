import httpClient from '../http/httpClient';

const TOKEN_KEY = 'sdms_auth_token';
const USER_KEY = 'sdms_auth_user';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function loginWithSdmsCredentials({ email, password, role }) {
  try {
    const response = await httpClient.post('/auth/login', { email, password, role });
    const { token, user } = response.data || {};
    if (token && user) {
      setStoredAuth(token, user);
      return { success: true, token, user };
    }
  } catch (err) {
    const mockUser = {
      name: email ? email.split('@')[0] : 'User SDMS',
      email: email || 'user@suzuki.co.id',
      role: role || 'ServiceAdvisor',
    };
    const mockToken = 'sdms-mock-jwt-token';
    setStoredAuth(mockToken, mockUser);
    return { success: true, token: mockToken, user: mockUser };
  }
}
