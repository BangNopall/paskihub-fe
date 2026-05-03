import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
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

  try {
    // 1. Resolve EventID for this Organizer
    const events = await profileService.getEventsByUserId(
      session.accessToken,
      session.user.id
    )

    if (!events || events.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-amber-500" />
          <h2 className="font-montserrat text-xl font-bold text-slate-900">
            Event Tidak Ditemukan
          </h2>
          <p className="mt-2 text-slate-600">
            Anda belum memiliki event yang terdaftar. Silakan buat event
            terlebih dahulu.
          </p>
        </div>
      )
    }

    const eventId = events[0].id // 1 Organizer = 1 Event rule

    // 2. Fetch Judges for this Event
    const judges = await judgeService.getAllJudges(session.accessToken, eventId)

    return <JudgeManagement eventId={eventId} initialJudges={judges} />
  } catch (error) {
    console.error("Gagal memuat data juri:", error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <p className="mt-2 text-slate-600">
          Terjadi kesalahan saat mengambil data juri dari server.
        </p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          // In Next.js, this simple client reload logic inside a Server Component
          // isn't ideal but keep it for UX consistency with previous mock
        >
          Muat Ulang
        </Button>
      </div>
    )
  }
}
