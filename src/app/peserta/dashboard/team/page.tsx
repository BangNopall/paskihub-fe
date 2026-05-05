import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { teamService } from "@/services/team.service"
import TeamListClient from "./_components/team-list-client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export default async function PesertaTeamPage() {
  const session: any = await getServerSession(authOptions)
  const token = session?.accessToken
  if (!session?.accessToken) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Sesi Berakhir
        </h2>
        <p className="mt-2 text-neutral-600">
          Silakan login kembali untuk mengakses profil.
        </p>
      </div>
    )
  }

  const teams = await teamService.getTeams(token)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Team Saya
          </h1>
          <Link href="/peserta/dashboard/team/new" className="w-full sm:w-auto">
            <Button
              className="w-full rounded-full px-6 font-poppins font-bold text-white shadow-sm"
              variant={"secondary"}
            >
              <Plus className="mr-2 h-4 w-4" /> Buat Tim Baru
            </Button>
          </Link>
        </div>

        <TeamListClient initialTeams={teams} token={token} />
      </div>
    </div>
  )
}
