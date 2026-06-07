import { getServerSession } from "next-auth/next"
import { authOptions, getOrganizerUserId } from "@/lib/auth"
import { judgeService } from "@/services/judge.service"
import { profileService } from "@/services/profile.service"
import JudgeManagement from "@/components/organizer/judge-management"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OrganizerJuryPage() {
  const session: any = await getServerSession(authOptions)

  if (!session?.accessToken || !session?.user?.id) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Sesi Berakhir
        </h2>
        <p className="mt-2 text-slate-600">
          Silakan login kembali untuk mengakses halaman ini.
        </p>
      </div>
    )
  }

  let eventId
  let judges
  let hasEvent = true

  try {
    // 1. Resolve EventID for this Organizer
    const events = await profileService.getEventsByUserId(
      session.accessToken,
      getOrganizerUserId(session)
    )

    if (!events || events.length === 0) {
      hasEvent = false
    } else {
      eventId = events[0].id // 1 Organizer = 1 Event rule
      // 2. Fetch Judges for this Event
      judges = await judgeService.getAllJudges(session.accessToken, eventId)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Gagal memuat data juri:", error)
  }

  if (!hasEvent) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-amber-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Event Tidak Ditemukan
        </h2>
        <p className="mt-2 text-slate-600">
          Anda belum memiliki event yang terdaftar. Silakan buat event terlebih
          dahulu.
        </p>
      </div>
    )
  }

  if (!eventId || !judges) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <p className="mt-2 text-slate-600">
          Terjadi kesalahan saat mengambil data juri dari server.
        </p>
        <Button variant="outline" className="mt-4 rounded-full">
          Muat Ulang
        </Button>
      </div>
    )
  }

  return <JudgeManagement eventId={eventId} initialJudges={judges} />
}
