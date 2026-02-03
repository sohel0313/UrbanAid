const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9070";

export function getApiBase() {
  return API_BASE;
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  const text = await res.text();
  const json = contentType?.includes("application/json") ? JSON.parse(text || "null") : text;

  if (!res.ok) {
    const msg = (json && json.message) || (typeof json === "string" && json) || res.statusText;
    const error: any = new Error(msg);
    error.status = res.status;
    error.body = json;
    throw error;
  }

  return json;
}

export async function publicPost(path: string, body: any) {
  return fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handleResponse);
}

export async function authFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(opts.headers as HeadersInit | undefined);

  if (!(opts.body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(API_BASE + path, { ...opts, headers }).then(handleResponse);
}

export async function authPost(path: string, body: any) {
  return authFetch(path, { method: "POST", body: JSON.stringify(body) });
}

export async function authGet(path: string) {
  return authFetch(path, { method: "GET" });
}

export async function authPut(path: string, body?: any) {
  return authFetch(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
}

export async function uploadImage(path: string, formData: FormData) {
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(API_BASE + path, { method: "POST", body: formData, headers }).then(handleResponse);
}
