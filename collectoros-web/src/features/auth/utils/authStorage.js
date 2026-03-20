const ACCESS_TOKEN_KEY = "collectoros_access_token";
const REFRESH_TOKEN_KEY = "collectoros_refresh_token";

let listeners = [];

function notifyAuthChange() {
  listeners.forEach((listener) => listener());
}

function subscribeAuth(listener) {
  listeners.push(listener);

  return () => {
    listeners = listeners.filter(
      (currentListener) => currentListener !== listener
    );
  };
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAuthChange(); 
}

function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  notifyAuthChange(); 
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  notifyAuthChange(); 
}

function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  notifyAuthChange(); 
}

function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  notifyAuthChange(); 
}

function hasAccessToken() {
  return Boolean(getAccessToken());
}

export {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  clearAuthTokens,
  hasAccessToken,
  subscribeAuth, 
};