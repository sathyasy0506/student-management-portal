import apiEndpoints from "../../api/api";

const TOKEN_KEY         = "sms_portal_token";
const REFRESH_TOKEN_KEY = "sms_portal_refresh_token";
const USER_KEY          = "sms_portal_user";

export const AUTH_EXPIRED_EVENT = "auth:expired";

// A single in-flight refresh promise so parallel requests don't all call /refresh
let refreshPromise = null;

function notifyAuthExpired(message) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_EXPIRED_EVENT, {
      detail: { message: message || "Session expired. Please login again." },
    })
  );
}

function isHardAuthFailure(response, data) {
  const message = data?.message?.toLowerCase?.() || "";
  // These messages mean the refresh token is gone too — force logout
  return (
    message === "refresh token expired or invalid. please log in again." ||
    message === "token missing" ||
    message === "invalid token type"
  );
}

function isAccessTokenFailure(response, data) {
  const message = data?.message?.toLowerCase?.() || "";
  return (
    response.status === 401 ||
    response.status === 403 ||
    message === "invalid or expired token" ||
    message === "token has been logged out"
  );
}

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (isHardAuthFailure(response, data)) {
    clearAuthStorage();
    notifyAuthExpired(data?.message);
    throw new Error(data?.message || "Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  if (data && data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function loginUser(payload) {
  const response = await fetch(apiEndpoints.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await parseResponse(response);

  const token        = result?.data?.token;
  const refreshToken = result?.data?.refresh_token;
  const user         = result?.data?.user;

  if (!token || !refreshToken) {
    throw new Error("Tokens not received from server");
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));

  return result;
}

export async function signupUser(payload) {
  const response = await fetch(apiEndpoints.signup, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return await parseResponse(response);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken() && !!getRefreshToken();
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Called on every app load — if refresh token exists and is valid, silently get fresh tokens.
// Returns true if successful, false if the user needs to log in.
export async function silentRefresh() {
  if (!getRefreshToken()) return false;
  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
}

// Try to get a new access token using the refresh token.
// Returns the new access token string, or throws if refresh token is expired.
async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await fetch(apiEndpoints.refresh, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.data?.token) {
      clearAuthStorage();
      notifyAuthExpired(data?.message);
      throw new Error(data?.message || "Session expired. Please login again.");
    }

    const newToken        = data.data.token;
    const newRefreshToken = data.data.refresh_token;
    localStorage.setItem(TOKEN_KEY, newToken);
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }
    return newToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function logoutUser() {
  try {
    await fetch(apiEndpoints.logout, { method: "POST" });
  } catch {
    // Ignore network errors on logout
  } finally {
    clearAuthStorage();
  }
}

export async function fetchProtected(url, options = {}) {
  let token = getToken();

  const buildHeaders = (t) => ({
    Authorization: `Bearer ${t}`,
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  });

  let response = await fetch(url, { ...options, headers: buildHeaders(token) });

  // If access token expired, try to refresh once
  if (response.status === 401 || response.status === 403) {
    const clonedData = await response.json().catch(() => null);

    if (isAccessTokenFailure(response, clonedData) && getRefreshToken()) {
      try {
        token = await refreshAccessToken();
        response = await fetch(url, { ...options, headers: buildHeaders(token) });
      } catch {
        // refreshAccessToken already cleared storage and fired event
        throw new Error("Session expired. Please login again.");
      }
    }
  }

  return response;
}

export async function protectedJson(url, options = {}) {
  const response = await fetchProtected(url, options);
  return await parseResponse(response);
}
