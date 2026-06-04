import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function setRefreshToken(token: string | null) {
  if (!token) {
    localStorage.removeItem('refreshToken');
    return;
  }

  localStorage.setItem('refreshToken', token);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setAuthTokens(nextAccessToken: string | null, nextRefreshToken: string | null) {
  setAccessToken(nextAccessToken);
  setRefreshToken(nextRefreshToken);
}

export function clearAuthTokens() {
  setAuthTokens(null, null);
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean } | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.headers?.['X-Skip-Auth-Refresh']) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuthTokens();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post('/auth/refresh', { refreshToken })
        .then(({ data }) => {
          const nextAccessToken = data.accessToken ?? null;
          const nextRefreshToken = data.refreshToken ?? refreshToken;
          setAuthTokens(nextAccessToken, nextRefreshToken);
          return nextAccessToken;
        })
        .catch(() => {
          clearAuthTokens();
          window.location.assign('/login');
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const nextAccessToken = await refreshPromise;
    if (!nextAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
    return api.request(originalRequest);
  }
);

export default api;
