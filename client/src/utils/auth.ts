export const getToken = (): string | null => {
  return localStorage.getItem('artjiya_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('artjiya_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('artjiya_token');
};

export const authHeaders = (): Record<string, string> => {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};