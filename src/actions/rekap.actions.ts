"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { rekapService } from "@/services/rekap.service"

const REVALIDATE_PATH = "/organizer/dashboard/score-recap"

async function getSession() {
  const session: any = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error("Unauthorized")
  return session
}

export async function publishScoreboardAction(
  eventLevelId: string,
  isPublished: boolean
) {
  try {
    const session = await getSession()
    await rekapService.publishScoreboard(
      eventLevelId,
      isPublished,
      session.accessToken
    )
    revalidatePath(REVALIDATE_PATH)
    return {
      success: true,
      message: isPublished
        ? "Hasil berhasil dipublikasikan"
        : "Publikasi hasil dibatalkan",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengubah status publikasi",
    }
  }
}

export async function getLeaderboardCustomAction(
  eventLevelId: string,
  categoryIds: string[]
) {
  try {
    const session = await getSession()
    const data = await rekapService.getLeaderboardCustom(
      eventLevelId,
      categoryIds,
      session.accessToken
    )
    return { success: true, data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengambil data leaderboard",
    }
  }
}

export async function getTeamAssessmentDetailAction(regisId: string) {
  try {
    const session = await getSession()
    const data = await rekapService.getTeamAssessmentDetail(
      regisId,
      session.accessToken
    )
    return { success: true, data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengambil detail penilaian tim",
    }
  }
}

export async function getScoreboardAction(eventLevelId: string) {
  try {
    const session = await getSession()
    const data = await rekapService.getScoreboard(
      eventLevelId,
      session.accessToken
    )
    return { success: true, data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mengambil data scoreboard",
    }
  }
}
