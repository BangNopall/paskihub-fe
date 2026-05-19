import React from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { profileService } from "@/services/profile.service"
import { eoTeamService } from "@/services/eo-team.service"
import { TeamAssessmentList } from "@/components/organizer/team-assessment-list"
import { isApprovedTeamPaymentStatus } from "@/lib/team-status"

export default async function AssessmentFormListPage() {
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const events = await profileService.getEventsByUserId(
    session.accessToken,
    session.user.id
  )

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Belum ada event yang dibuat
        </h2>
      </div>
    )
  }

  const eventId = events[0].id
  const teams = await eoTeamService.getTeamList(session.accessToken, eventId)
  const approvedTeams = teams.filter((team) =>
    isApprovedTeamPaymentStatus(team.payment_status)
  )

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Form Penilaian
        </h1>

        <TeamAssessmentList eventId={eventId} teams={approvedTeams} />
      </div>
    </div>
  )
}
