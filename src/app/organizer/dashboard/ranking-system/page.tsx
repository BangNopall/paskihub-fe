import React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import { assessmentService } from "@/services/assessment.service"
import { RankingSystemClient, RankingAward } from "./ranking-system-client"

// ==========================================
// MAIN SERVER COMPONENT
// ==========================================

export default async function RankingSystemPage() {
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  // 1. Ambil data event aktif (sama seperti layout)
  const events = await profileService.getEventsByUserId(
    session.accessToken,
    session.user.id
  )
  if (events.length === 0) redirect("/organizer/dashboard")

  const activeEvent = events[0]
  const eventId = activeEvent.id

  // 2. Persiapkan data Jenjang dan Kategori Penilaian
  const eventLevels =
    activeEvent.event_levels?.map((l: any) => ({
      id: l.id,
      name: l.name,
    })) || []

  // 3. Fetch Score Categories untuk setiap level secara paralel
  const scoreCategories: { id: string; name: string; eventLevelId: string }[] =
    []

  try {
    const unifiedResults = await Promise.all(
      eventLevels.map((lvl: any) =>
        assessmentService.getUnifiedAssessment(
          eventId,
          lvl.id,
          session.accessToken
        )
      )
    )

    unifiedResults.forEach((res, index) => {
      const levelId = eventLevels[index].id
      res.categories.forEach((cat: any) => {
        scoreCategories.push({
          id: cat.id,
          name: cat.name,
          eventLevelId: levelId,
        })
      })
    })
  } catch (error) {
    console.error("Gagal mengambil data kategori penilaian:", error)
    // Lanjutkan dengan array kosong jika gagal, client akan menampilkan warning
  }

  // 4. Mock Data for Awards (Until Backend API is ready)
  // TODO: Fetch from new API GET /api/v1/eo/events/{eventId}/awards
  const initialAwards: RankingAward[] = []

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Sistem Juara
        </h1>

        <RankingSystemClient
          eventId={eventId}
          eventLevels={eventLevels}
          scoreCategories={scoreCategories}
          initialData={initialAwards}
        />
      </div>
    </div>
  )
}
