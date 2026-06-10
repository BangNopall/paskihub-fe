import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { participantEventService } from "@/services/participant-event.service"
import { teamService } from "@/services/team.service"
import MyEventClient from "./MyEventClient"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MyEventPage(props: Props) {
  const session: any = await getServerSession(authOptions)
  const token = session?.accessToken

  const searchParams = await props.searchParams
  const location =
    typeof searchParams.location === "string"
      ? searchParams.location
      : undefined
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined

  const [openEvents, activeEvents, myTeams] = await Promise.all([
    participantEventService.getOpenEvents(token, location, search),
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
