import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'taskflow-storage',
});

export const secureStorage = new MMKV({
  id: 'taskflow-secure-storage',
  encryptionKey: 'taskflow-encryption-key',
});

export const StorageKeys = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const tokenStorage = {
  getAccessToken: () => secureStorage.getString(StorageKeys.ACCESS_TOKEN),
  setAccessToken: (token: string) =>
    secureStorage.set(StorageKeys.ACCESS_TOKEN, token),
  getRefreshToken: () => secureStorage.getString(StorageKeys.REFRESH_TOKEN),
  setRefreshToken: (token: string) =>
    secureStorage.set(StorageKeys.REFRESH_TOKEN, token),
  clearTokens: () => {
    secureStorage.delete(StorageKeys.ACCESS_TOKEN);
    secureStorage.delete(StorageKeys.REFRESH_TOKEN);
  },
};
