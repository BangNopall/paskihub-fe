import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { participantEventService } from "@/services/participant-event.service"
import { teamService } from "@/services/team.service"
import MyEventClient from "./MyEventClient"

export default async function MyEventPage() {
  const session: any = await getServerSession(authOptions)
  const token = session?.accessToken

  const [openEvents, activeEvents, myTeams] = await Promise.all([
    participantEventService.getOpenEvents(token),
    participantEventService.getActiveEvents(token),
    teamService.getTeams(token),
  ])

  return (
    <MyEventClient
      initialOpenEvents={openEvents}
      initialActiveEvents={activeEvents}
      myTeams={myTeams}
    />
  )
}
