import React from "react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft, AlertCircle } from "lucide-react"

import { profileService } from "@/services/profile.service"
import { eoTeamService } from "@/services/eo-team.service"
import { assessmentService } from "@/services/assessment.service"
import { AssessmentForm } from "@/components/organizer/assessment-form"
import { startAssessmentAction } from "@/actions/eo-team.actions"
import { Button } from "@/components/ui/button"

export default async function AssessmentFormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: registrationId } = await params
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  try {
    const events = await profileService.getEventsByUserId(
      session.accessToken,
      session.user.id
    )

    if (!events || events.length === 0) {
      redirect("/organizer/dashboard/assessment-form")
    }

    const event = events[0]
    const eventId = event.id

    // Fetch team detail
    const team = await eoTeamService.getTeamDetail(
      session.accessToken,
      eventId,
      registrationId
    )

    if (!team) {
      notFound()
    }

    // Resolve Level ID
    // 1. Check if backend already provides it
    let levelId = (team as any).event_level_id

    // 2. Fallback: match by name from event levels list
    if (!levelId) {
      const matchedLevel = event.event_levels?.find(
        (l: any) => l.name === team.event_level
      )
      levelId = matchedLevel?.id
    }

    if (!levelId) {
      throw new Error("Gagal menentukan level event untuk tim ini.")
    }

    // Fetch dependencies
    const [judges, unifiedData] = await Promise.all([
      assessmentService.getJudges(eventId, session.accessToken),
      assessmentService.getUnifiedAssessment(
        eventId,
        levelId,
        session.accessToken
      ),
    ])

    // Trigger "Sedang Dinilai" status if currently PENDING
    // Note: StartAssessment BE logic only updates if status is PENDING
    await startAssessmentAction(eventId, registrationId)

    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-col gap-6">
            <Link
              href="/organizer/dashboard/assessment-form"
              className="flex w-fit items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-montserrat text-base font-semibold md:text-lg">
                Kembali
              </span>
            </Link>
          </div>

          <AssessmentForm
            team={team}
            unifiedData={unifiedData}
            judges={judges}
            eventId={eventId}
          />
        </div>
      </div>
    )
  } catch (error: any) {
    console.error("Assessment Detail Error:", error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Form Penilaian
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {error.message ||
            "Pastikan data juri dan sistem penilaian sudah dikonfigurasi."}
        </p>
        <Link href="/organizer/dashboard/assessment-form" className="mt-6">
          <Button variant="outline">Kembali ke Daftar</Button>
        </Link>
      </div>
    )
  }
}
