import React from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { teamService } from "@/services/team.service"
import TeamEditClient from "./_components/team-edit-client"

export default async function EditTeamPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const token =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value

  if (!token) {
    return <div>Unauthorized</div>
  }

  const teamDetail = await teamService.getTeamDetail(id, token)

  if (!teamDetail) {
    notFound()
  }

  return <TeamEditClient initialData={teamDetail} id={id} />
}
