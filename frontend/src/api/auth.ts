import api, { clearAuthTokens, setAuthTokens } from './client';

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { error?: string } } }).response;
    return response?.data?.error ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export async function login(email: string, password: string) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthTokens(data.accessToken ?? null, data.refreshToken ?? null);
    return data as { user: AuthUser; accessToken: string; refreshToken: string };
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Login failed'));
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    const { data } = await api.post('/auth/register', { name, email, password });
    setAuthTokens(data.accessToken ?? null, data.refreshToken ?? null);
    return data as { user: AuthUser; accessToken: string; refreshToken: string };
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Registration failed'));
  }
}

export async function refresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    clearAuthTokens();
    return null;
  }

  const { data } = await api.post('/auth/refresh', { refreshToken }, {
    headers: { 'X-Skip-Auth-Refresh': 'true' }
  });

  setAuthTokens(data.accessToken ?? null, data.refreshToken ?? refreshToken);
  return data as { accessToken: string; refreshToken: string; user: AuthUser };
}

export async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await api.post('/auth/logout', { refreshToken }, {
      headers: { 'X-Skip-Auth-Refresh': 'true' }
    });
  }

  clearAuthTokens();
}
