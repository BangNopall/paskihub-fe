/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { teamService } from "@/services/team.service"
import TeamEditClient from "./_components/team-edit-client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export default async function EditTeamPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
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

  const teamDetail = await teamService.getTeamDetail(id, token)

  if (!teamDetail) {
    notFound()
  }

  return <TeamEditClient initialData={teamDetail} id={id} />
}
