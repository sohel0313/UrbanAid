import { authGet, authPost, authPut, uploadImage, getApiBase } from "../api";

// report.ts
export interface ReportFormData {
  title: string;
  description: string;
  category: string;
  address: string;
  location:string;
  latitude?: number;
  longitude?: number;

  image?: File;
}


function mapCategory(c: string) {
  // Map frontend category to backend Category enum
  switch (c) {
    case "road-damage":
      return "ROADS";
    case "streetlight":
      return "ELECTRICITY";
    case "garbage":
      return "WASTE_MANAGEMENT";
    case "graffiti":
      return "PUBLIC_SAFETY";
    case "water-leak":
      return "WATER_SUPPLY";
    case "noise":
      return "PUBLIC_SAFETY";
    default:
      return "ENVIRONMENT";
  }
}

export async function uploadReportImage(file: File) {
  const fd = new FormData();
  fd.append("image", file);
  return uploadImage("/reports/upload-image", fd);
}

export async function createReport(data: ReportFormData, citizenId: number) {
  let imagepath: string | undefined;
  if (data.image) {
    try {
      const resp = await uploadReportImage(data.image);
      // server returns file path string
      imagepath = Array.isArray(resp) ? resp[0] : resp;
    } catch (e) {
      console.error("Image upload failed", e);
      throw e;
    }
  }

 const payload = {
  description: data.description,
  location: data.location,

  latitude: data.latitude ?? null,
  longitude: data.longitude ?? null,

  imagepath: imagepath,
  category: mapCategory(data.category),
};


  return authPost(`/reports?citizenId=${citizenId}`, payload);
}

function mapCategoryBack(cat: string) {
  switch (cat) {
    case 'ROADS':
      return 'road-damage';
    case 'ELECTRICITY':
      return 'streetlight';
    case 'WASTE_MANAGEMENT':
      return 'garbage';
    case 'PUBLIC_SAFETY':
      return 'other';
    case 'WATER_SUPPLY':
      return 'water-leak';
    default:
      return 'other';
  }
}


export function mapDtoToReport(dto: any) {
  const status = (dto.status || '').toString().toLowerCase().replace(/_/g, '-');
  const img = dto.imagepath ? `${getApiBase().replace(/\/$/, '')}/${dto.imagepath}` : undefined;
  return {
    id: dto.id ? String(dto.id) : undefined,
    title: dto.description ? (dto.description.split('\n')[0] ?? dto.description) : 'Report',
    description: dto.description,
    category: mapCategoryBack(dto.category),
    status: status,
    location: {
      address: dto.location,
      lat: dto.latitude ?? 0,
      lng: dto.longitude ?? 0,
    },
    imageUrl: img,
    citizenId: dto.citizenId ? String(dto.citizenId) : undefined,
    volunteerId: dto.volunteerId ? String(dto.volunteerId) : undefined,
    createdAt: dto.creationDate ? new Date(dto.creationDate) : new Date(),
    updatedAt: dto.lastUpdated ? new Date(dto.lastUpdated) : new Date(),
  };
}

export async function getNearbyReports(volunteerId: number) {
  return authGet(`/reports/nearby?volunteerId=${volunteerId}`);
}

export async function claimReport(reportId: number, volunteerId: number) {
  return authPut(`/reports/${reportId}/claim?volunteerId=${volunteerId}`);
}

export async function updateReportStatus(reportId: number, status: string, volunteerId: number) {
  return authPut(`/reports/${reportId}/status?status=${encodeURIComponent(status)}&volunteerId=${volunteerId}`);
}

export async function getMyReports() {
  return authGet(`/reports/my`);
}

export async function getReportById(reportId: number) {
  return authGet(`/reports/${reportId}`);
}

export async function getAllReports() {
  return authGet(`/reports/all`);
}
