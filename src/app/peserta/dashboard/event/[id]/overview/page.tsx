import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { participantEventService } from "@/services/participant-event.service"
import EventOverviewClient from "./EventOverviewClient"

export default async function EventOverviewPage({ params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions)
  const token = session?.accessToken

  const registrationDetail = await participantEventService.getRegistrationDetail(params.id, token)

  let recap = null
  let scoreboard = null

  if (registrationDetail?.event?.id) {
    recap = await participantEventService.getAssessmentRecap(params.id, token).catch(() => null)
  }

  // Get event_level_id from registrationDetail
  // Since our API currently doesn't return event_level_id explicitly in Detail Response...
  // Wait, let's see if we can get it from getActiveEvents or fetch it separately. 
  // For now, scoreboard endpoint requires eventLevelId. We'll pass it if we have it.
  // We can fetch it if needed, or we just pass the regisID for now and see if the UI needs it.
  // Let's assume we can get it or we just don't fetch scoreboard here for now since it needs eventLevelID.
  // Actually, we can fetch scoreboard if we know the level ID. We'll handle it inside the client or update the BE.
  // For now, we pass what we have.

  return (
    <EventOverviewClient 
      registrationId={params.id}
      registrationDetail={registrationDetail}
      recap={recap}
      scoreboard={scoreboard}
    />
  )
}
