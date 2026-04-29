"use server"

import { profileService } from "@/services/profile.service";
import { 
  eoDataFormSchema, EODataFormData,
  pesertaDataFormSchema, PesertaDataFormData
} from "@/schemas/profile.schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createEventAction(data: EODataFormData) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error("Unauthorized");

    const parsed = eoDataFormSchema.parse(data);
    await profileService.createEvent(parsed, session.accessToken);
    return { success: true, message: "Event berhasil dibuat." };
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" };
  }
}

export async function updatePesertaProfileAction(data: PesertaDataFormData) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error("Unauthorized");

    const parsed = pesertaDataFormSchema.parse(data);
    await profileService.updatePesertaProfile(parsed, session.accessToken);
    return { success: true, message: "Profil berhasil diperbarui." };
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" };
  }
}
