import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import { assessmentService } from "@/services/assessment.service"
import AssessmentSystemClient from "./client-page"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import Link from "next/link"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AssessmentSystemPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  try {
    // 1. Fetch Events for current Organizer
    const events = await profileService.getEventsByUserId(
      session.accessToken,
      session.user.id
    )

    if (!events || events.length === 0) {
      redirect("/auth/register/eo/data-form")
    }

    const event = events[0]
    const eventId = event.id
    const levels =
      event.event_levels?.map((l: any) => ({
        id: l.id,
        name: l.name,
      })) || []

    if (levels.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 h-12 w-12 text-amber-500">⚠️</div>
          <h2 className="font-montserrat text-xl font-bold text-slate-900">
            Jenjang Belum Ditentukan
          </h2>
          <p className="mt-2 text-slate-500">
            Silahkan tambahkan jenjang tingkat (SD/SMP/SMA) di menu My Event
            terlebih dahulu.
          </p>
        </div>
      )
    }

    // 2. Determine active level
    const activeLevelId = (searchParams.level as string) || levels[0].id

    // 3. Fetch Assessment Data for the active level
    const assessmentData = await assessmentService.getUnifiedAssessment(
      eventId,
      activeLevelId,
      session.accessToken
    )

    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
          {/* HEADER */}
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Sistem Penilaian
          </h1>

          <Suspense fallback={<div>Loading...</div>}>
            <AssessmentSystemClient
              eventId={eventId}
              levels={levels}
              activeLevelId={activeLevelId}
              initialData={assessmentData}
            />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in AssessmentSystemPage:", error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 h-12 w-12 text-red-500">❌</div>
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Terjadi Kesalahan
        </h2>
        <p className="mt-2 text-slate-500">
          Gagal memuat data sistem penilaian.
        </p>
        <Link href="/organizer/dashboard/assessment-system">
          <Button variant="outline" className="mt-4 rounded-full">
            Coba Lagi
          </Button>
        </Link>
      </div>
    )
  }
}
