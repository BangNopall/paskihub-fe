import React from "react"
import { AlertCircle } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import { rankingService } from "@/services/ranking.service"
import { rekapService } from "@/services/rekap.service"
import ScoreRecapClient from "./score-recap-client"

export default async function ScoreRecapPage() {
  const session: any = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Akses Ditolak
        </h2>
        <p className="mt-2 text-neutral-500">Silakan login kembali.</p>
      </div>
    )
  }

  // 1. Get Event Data
  const events = await profileService.getEventsByUserId(
    session.accessToken,
    session.user.id
  )
  const event = events.length > 0 ? events[0] : null

  if (!event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-yellow-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Belum Ada Event
        </h2>
        <p className="mt-2 text-neutral-500">
          Anda belum memiliki event aktif.
        </p>
      </div>
    )
  }

  // 2. Fetch Initial Data for Score Recap
  const levels = (event.event_levels || []).map((l: any) => ({
    id: l.id,
    name: l.name,
  }))

  if (levels.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-yellow-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Belum Ada Jenjang
        </h2>
        <p className="mt-2 text-neutral-500">
          Silakan tambahkan jenjang lomba di menu My Event terlebih dahulu.
        </p>
      </div>
    )
  }

  try {
    const [awards, initialScoreboardRes] = await Promise.all([
      rankingService.getAwards(event.id, session.accessToken),
      rekapService.getScoreboard(levels[0].id, session.accessToken),
    ])

    return (
      <ScoreRecapClient
        eventId={event.id}
        levels={levels}
        initialAwards={awards}
        initialScoreboard={initialScoreboardRes.items}
      />
    )
  } catch (error) {
    console.error("Error fetching score recap data:", error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Terjadi Kesalahan
        </h2>
        <p className="mt-2 text-neutral-500">
          Gagal memuat data rekap nilai. Silakan coba lagi nanti.
        </p>
      </div>
    )
  }
}
