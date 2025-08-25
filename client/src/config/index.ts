export const SERVER_PATH =
  import.meta.env.VITE_SERVER_PATH || "http:localhost:3002";
export const SERVER_PATH_API = `${SERVER_PATH}/api`;
export const STORAGE_KEY =
  import.meta.env.VITE_STORAGE_KEY || "default_storage_key";

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "default_google_client_id";

export const GOOGLE_AUTH_USER_INFO_LINK =
  import.meta.env.VITE_GOOGLE_AUTH_USER_INFO_LINK ||
  "https://www.googleapis.com/oauth2/v3/userinfo";

export const FACEBOOK_AUTH_ID = import.meta.env.VITE_FACEBOOK_AUTH_ID;
export const GITHUB_AUTH_ID = import.meta.env.VITE_GITHUB_AUTH_ID
export const GITHUB_AUTH_CLIENT_SECRET = import.meta.env.VITE_GITHUB_AUTH_CLIENT_SECRET


