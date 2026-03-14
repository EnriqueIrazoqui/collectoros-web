const TOKEN_KEY = "collectoros_token";

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasAccessToken = () => {
  return Boolean(getAccessToken());
};