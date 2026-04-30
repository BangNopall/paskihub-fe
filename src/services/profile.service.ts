import { EODataFormData, PesertaDataFormData } from "@/schemas/profile.schema";

const API_URL = process.env.API_BASE_URL || "http://localhost:3010";
const API_KEY = process.env.API_KEY;

export const profileService = {
  async createEvent(data: EODataFormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/events/create`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create event");
    }
    return res.json();
  },

  async updatePesertaProfile(data: PesertaDataFormData, token: string) {
    const res = await fetch(`${API_URL}/api/v1/peserta/profile`, {
      method: "PUT", // Assuming PUT for profile update based on typical REST, the swagger says GET, PUT
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update profile");
    }
    return res.json();
  }
};
