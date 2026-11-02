import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10_000,
  withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS === 'true',
  headers: { Accept: 'application/json' },
});

export interface ApiHealth {
  status: 'ok';
  message: 'pong';
  service: string;
}

export const getApiHealth = async (): Promise<ApiHealth> => {
  const response = await api.get<ApiHealth>('/ping');

  return response.data;
};

export interface MarketplaceStateResponse<T> {
  initialized: boolean;
  schemaVersion: number;
  revision: number;
  data: T | null;
  migratedFromLocalStorage?: boolean;
  lastSyncedAt: string | null;
}

export interface SaveMarketplaceStatePayload<T> {
  schemaVersion: number;
  revision: number;
  migratedFromLocalStorage?: boolean;
  data: T;
}

export const getMarketplaceState = async <T>(): Promise<MarketplaceStateResponse<T>> => {
  const response = await api.get<MarketplaceStateResponse<T>>('/marketplace-state');

  return response.data;
};

export const saveMarketplaceState = async <T>(
  payload: SaveMarketplaceStatePayload<T>,
): Promise<MarketplaceStateResponse<T>> => {
  const response = await api.put<MarketplaceStateResponse<T>>('/marketplace-state', payload);

  return response.data;
};

export default api;
