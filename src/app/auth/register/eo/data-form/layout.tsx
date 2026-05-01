import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"

export default async function EODataFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const response = await profileService.getEventsByUserId(session.accessToken, session.user.id)
  const events = response || []
  
  if (events.length > 0) {
    const event = events[0]
    const isProfileIncomplete =
      !event.bank_name ||
      !event.bank_number ||
      !event.close_date ||
      !event.location ||
      (!event.name_pj && !event.nama_pj) ||
      !event.name ||
      !event.no_wa_pj ||
      !event.open_date ||
      !event.organizer

    if (!isProfileIncomplete) {
      redirect("/organizer/dashboard")
    }
  }

  return <>{children}</>
}
