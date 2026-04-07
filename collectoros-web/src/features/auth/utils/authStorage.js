const ACCESS_TOKEN_KEY = "collectoros_access_token";
const REFRESH_TOKEN_KEY = "collectoros_refresh_token";

let listeners = [];

function notifyAuthChange() {
  listeners.forEach((listener) => listener());
}

function handleStorageChange(event) {
  if (
    event.key === ACCESS_TOKEN_KEY ||
    event.key === REFRESH_TOKEN_KEY ||
    event.key === null
  ) {
    notifyAuthChange();
  }
}

function subscribeAuth(listener) {
  listeners.push(listener);

  if (listeners.length === 1) {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    listeners = listeners.filter(
      (currentListener) => currentListener !== listener,
    );

    if (listeners.length === 0) {
      window.removeEventListener("storage", handleStorageChange);
    }
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