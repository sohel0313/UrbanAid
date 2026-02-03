import { publicPost, setToken, getApiBase, authGet } from "../api";

export interface SignInResp {
  jwt: string;
  message?: string;
  role?: string;
  userId?: number;
}

export async function signIn(email: string, password: string): Promise<SignInResp> {
  const resp = await publicPost("/users/signin", { email, password });
  if (resp && resp.jwt) {
    // store token
    setToken(resp.jwt);
    if (resp.role) localStorage.setItem("userRole", resp.role);
    if (resp.userId) localStorage.setItem("userId", String(resp.userId));

    // fetch user details to get the name for UI
    if (resp.userId) {
      try {
        const user = await authGet(`/users/${resp.userId}`);
        if (user && user.name) localStorage.setItem("userName", user.name);
      } catch (e) {
        // ignore errors here
      }
    }
  }
  return resp;
}

export async function getUserById(id: number) {
  return authGet(`/users/${id}`);
} 

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "citizen" | "volunteer" | "admin";
  mobile?: string;
}

function mapRoleToUserType(role: RegisterPayload['role']) {
  switch (role) {
    case "citizen":
      return "ROLE_CITIZEN";
    case "volunteer":
      return "ROLE_VOLUNTEER";
    case "admin":
      return "ROLE_ADMIN";
    default:
      return "ROLE_CITIZEN";
  }
}

export async function register(payload: RegisterPayload) {
  // backend requires CreateUserDTO - minimum: email, mobile, name, password, userType
  const body = {
    email: payload.email,
    mobile: payload.mobile,
    bio: "",
    name: payload.name,
    password: payload.password,
    userType: mapRoleToUserType(payload.role),
  };

  return publicPost("/users/register", body);
}

export function signOut() {
  setToken(null);
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
}

export function getUserRole(): string | null {
  return localStorage.getItem("userRole");
}

export function getUserId(): number | null {
  const v = localStorage.getItem("userId");
  return v ? Number(v) : null;
}
