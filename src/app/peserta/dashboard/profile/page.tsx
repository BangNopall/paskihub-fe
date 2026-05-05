import React from "react"
import { AlertCircle } from "lucide-react"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import { ProfileForm } from "@/components/peserta/profile-form"
import { Button } from "@/components/ui/button"

export default async function ParticipantProfilePage() {
  const session: any = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Sesi Berakhir
        </h2>
        <p className="mt-2 text-neutral-600">
          Silakan login kembali untuk mengakses profil.
        </p>
      </div>
    )
  }

  const profileData = await profileService.getPesertaProfile(
    session.accessToken
  )

  if (!profileData || !profileData.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Profil
        </h2>
        <p className="mt-2 text-neutral-600">
          Terjadi kesalahan saat mengambil data profil dari server.
        </p>
        <Button className="mt-4 rounded-full bg-blue-500 hover:bg-blue-600">
          Muat Ulang
        </Button>
      </div>
    )
  }

  const profile = profileData.data

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Profil
          </h1>
          <p className="font-montserrat text-sm text-neutral-600">
            Kelola informasi profil dan keamanan akun kamu.
          </p>
        </div>

        <ProfileForm initialData={profile} />
      </div>
    </div>
  )
}
