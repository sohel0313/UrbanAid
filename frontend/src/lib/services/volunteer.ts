import { authGet, authPut } from "../api";

export async function getMyProfile() {
  return authGet('/volunteers/me');
}

export async function updateAvailability(volunteerId: number, availability: boolean) {
  return authPut(`/volunteers/${volunteerId}/availability`, { availability });
}
