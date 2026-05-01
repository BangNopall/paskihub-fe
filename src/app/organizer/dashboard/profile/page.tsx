import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import OrganizerProfileContent from "./OrganizerProfileContent"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OrganizerProfilePage() {
  const session: any = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Sesi Berakhir
        </h2>
        <p className="text-neutral-500 mt-2">Silakan login kembali untuk mengakses halaman ini.</p>
      </div>
    )
  }

  try {
    // Fetch initial data in parallel
    const [profileRes, staffRes] = await Promise.all([
      profileService.getEOProfile(session.accessToken),
      profileService.getEOStaff(session.accessToken)
    ])

    return (
      <OrganizerProfileContent 
        primaryEmail={profileRes.data.email} 
        initialStaff={staffRes.data || []} 
      />
    )
  } catch (error) {
    console.error("Profile page data fetch error:", error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Profil
        </h2>
        <p className="text-neutral-500 mt-2">Terjadi kesalahan saat mengambil data dari server.</p>
        <Button
          asChild
          className="mt-4 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          <a href="/organizer/dashboard/profile">Muat Ulang</a>
        </Button>
      </div>
    )
  }
}
