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

// Add these to your RegisterPayload interface
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "citizen" | "volunteer" | "admin";
  mobile?: string;
  // Extra fields for volunteer
  area?: string;
  latitude?: number;
  longitude?: number;
  skill?: string;
  vtype?: string;
}

export async function register(payload: RegisterPayload) {
  // 1. If the user is a Volunteer, use the Volunteer registration endpoint
  if (payload.role === "volunteer") {
    const volunteerBody = {
      user: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        mobile: payload.mobile,
        userType: "ROLE_VOLUNTEER", // Matches your UserType Enum
      },
      vtype: payload.vtype || "GENERAL_HELP",  // Matches your Vtype Enum in VolunteerDTO
      area: payload.area,
      latitude: payload.latitude,
      longitude: payload.longitude,
      availability: true,
      skill: payload.skill,
    };

    // Notice the different endpoint here
    return publicPost("/volunteers/register", volunteerBody);
  }

  // 2. Otherwise, use the standard Citizen registration
  const body = {
    email: payload.email,
    mobile: payload.mobile,
    bio: "",
    name: payload.name,
    password: payload.password,
    userType: "ROLE_CITIZEN",
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
