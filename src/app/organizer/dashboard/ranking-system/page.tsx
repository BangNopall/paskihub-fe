import React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import { assessmentService } from "@/services/assessment.service"
import { rankingService } from "@/services/ranking.service"
import { RankingSystemClient } from "./ranking-system-client"

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

  // 3. Fetch Score Categories dan Awards secara paralel
  let scoreCategories: { id: string; name: string; eventLevelId: string }[] = []
  let initialAwards: any[] = []

  try {
    const [unifiedResults, awards] = await Promise.all([
      Promise.all(
        eventLevels.map((lvl: any) =>
          assessmentService.getUnifiedAssessment(
            eventId,
            lvl.id,
            session.accessToken
          )
        )
      ),
      rankingService.getAwards(eventId, session.accessToken),
    ])

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

    initialAwards = awards.map((a) => ({
      id: a.id,
      event_level_id: a.event_level_id,
      name: a.name,
      limit_rank: a.limit_rank,
      score_category_ids: a.score_categories.map((c) => c.id),
      score_categories: a.score_categories,
    }))
  } catch (error) {
    console.error("Gagal mengambil data sistem ranking:", error)
  }

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
