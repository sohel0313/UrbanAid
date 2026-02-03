import { authGet } from "../api";
import * as ReportsService from "./reports";

export async function getAllReports() {
  const res = await authGet('/admin/reports');
  // remap DTOs to frontend Report shape
  return (res || []).map((r: any) => ReportsService.mapDtoToReport(r));
}

export async function getAllUsers() {
  return authGet('/admin/users');
}

export async function getAllVolunteers() {
  return authGet('/admin/volunteers');
}
