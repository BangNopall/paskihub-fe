import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"

export default async function PesertaDataFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const response = await profileService.getPesertaProfile(session.accessToken)
  const pesertaData = response

  if (pesertaData && !Array.isArray(pesertaData) && pesertaData.institution) {
    const inst = pesertaData.institution
    const isProfileIncomplete =
      !inst.name ||
      !inst.address ||
      !inst.institution_type ||
      !inst.name_pj ||
      !inst.no_wa_pj

    if (!isProfileIncomplete) {
      redirect("/peserta/dashboard")
    }
  }

  return <>{children}</>
}
