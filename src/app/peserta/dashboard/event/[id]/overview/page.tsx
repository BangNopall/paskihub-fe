import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { participantEventService } from "@/services/participant-event.service"
import EventOverviewClient from "./EventOverviewClient"

interface EventOverviewPageProps {
  params: Promise<{ id: string }>
}

export default async function EventOverviewPage({
  params,
}: EventOverviewPageProps) {
  const { id } = await params
  const session = (await getServerSession(authOptions)) as Session | null
  const token = session?.accessToken

  if (!token) {
    redirect("/auth/login")
  }

  const registrationDetail =
    await participantEventService.getRegistrationDetail(id, token)

  const [recap, scoreboard] = await Promise.all([
    registrationDetail
      ? participantEventService.getAssessmentRecap(id, token).catch(() => null)
      : Promise.resolve(null),
    registrationDetail?.event_level_id
      ? participantEventService
          .getScoreboard(registrationDetail.event_level_id, token)
          .catch(() => null)
      : Promise.resolve(null),
  ])

  return (
    <EventOverviewClient
      registrationId={id}
      registrationDetail={registrationDetail}
      recap={recap}
      scoreboard={scoreboard}
    />
  )
}
