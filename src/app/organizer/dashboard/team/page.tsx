import React from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { profileService } from "@/services/profile.service"
import { eoTeamService } from "@/services/eo-team.service"
import { systemSettingService } from "@/services/system-setting.service"
import TeamListClient, { TeamStats } from "./client"
import { EOTeamListRes } from "@/schemas/eo-team.schema"

export default async function OrganizerTeamListPage() {
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  // 1. Get active event
  const userEvents = await profileService.getEventsByUserId(
    session.accessToken,
    session.user.id
  )
  if (!userEvents || userEvents.length === 0) {
    redirect("/auth/register/eo/data-form")
  }
  const activeEvent = userEvents[0]
  const eventId = activeEvent.id

  // 2. Fetch team list, stats, and system settings in parallel
  let teams: EOTeamListRes[] = []
  let apiStats = null
  let systemSettings = null
  try {
    const [teamsRes, statsRes, settingsRes] = await Promise.all([
      eoTeamService.getTeamList(session.accessToken, eventId),
      eoTeamService.getTeamStats(session.accessToken, eventId),
      systemSettingService.getSettings(session.accessToken),
    ])
    teams = teamsRes
    apiStats = statsRes
    systemSettings = settingsRes
  } catch (error) {
    console.error("Error fetching teams, stats, or settings:", error)
  }

  // 3. Map stats
  const stats: TeamStats = apiStats
    ? {
        total: apiStats.total_teams,
        pending: apiStats.pending_approval,
        approved: apiStats.approved,
        rejected: apiStats.rejected,
        lunas: apiStats.paid_full,
        dp: apiStats.paid_dp,
      }
    : {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        lunas: 0,
        dp: 0,
      }

  const approvalFee = systemSettings?.approval_fee || 0

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Daftar Tim Peserta
          </h1>
        </div>

        <TeamListClient
          initialTeams={teams}
          stats={stats}
          eventId={eventId}
          approvalFee={approvalFee}
          token={session.accessToken}
        />
      </div>
    </div>
  )
}
