import { EGO_JWT_KEY } from 'global/constants';

export const getStoredJwt = (): string => localStorage.getItem(EGO_JWT_KEY) || '';
export const removeStoredJwt = () => {
  localStorage.removeItem(EGO_JWT_KEY);
};
export const setStoredToken = (token: string) => {
  localStorage.setItem(EGO_JWT_KEY, token);
}
