import React from "react"
import { Poppins } from "@/lib/fonts"
import { systemSettingService } from "@/services/system-setting.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import SystemSettingForm from "@/components/admin/system-setting-form"

export default async function AdminSettingsPage() {
  const session: any = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return (
      <div className={`flex flex-1 items-center justify-center ${Poppins.className}`}>
        <p className="text-neutral-500">Unauthorized</p>
      </div>
    )
  }

  let initialData = null
  let error = null

  try {
    initialData = await systemSettingService.getSettings(session.accessToken)
  } catch (err: any) {
    error = err.message || "Gagal memuat pengaturan"
  }

  if (error || !initialData) {
    return (
      <div className={`flex flex-1 items-center justify-center ${Poppins.className}`}>
        <p className="text-red-500">{error || "Terjadi kesalahan saat memuat data"}</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <SystemSettingForm initialData={initialData} />
      </div>
    </div>
  )
}
