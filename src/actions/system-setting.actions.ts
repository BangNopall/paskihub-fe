"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { systemSettingService } from "@/services/system-setting.service"
import { UpdateSystemSettingReq } from "@/schemas/system-setting.schema"
import { revalidatePath } from "next/cache"

export async function updateSystemSettingsAction(data: UpdateSystemSettingReq) {
  const session: any = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  await systemSettingService.updateSettings(session.accessToken, data)

  revalidatePath("/admin/dashboard/settings")
  return { success: true }
}
