import React from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"
import OrganizerEventForm, { EventData } from "@/components/organizer/event-form"
import { Button } from "@/components/ui/button"

export default async function OrganizerEventDetailPage() {
  const session: any = await getServerSession(authOptions)
  
  if (!session) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Akses Ditolak
        </h2>
        <p className="mt-2 text-neutral-500">Silakan login kembali.</p>
      </div>
    )
  }

  const events = await profileService.getEventsByUserId(session.accessToken, session.user.id)
  const event = events.length > 0 ? events[0] : null

  if (!event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-yellow-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Belum Ada Event
        </h2>
        <p className="mt-2 text-neutral-500">Anda belum membuat event apapun.</p>
        <Link href="/auth/register/eo/data-form">
          <Button className="mt-4 rounded-full bg-blue-500 hover:bg-blue-600">
            Buat Event Sekarang
          </Button>
        </Link>
      </div>
    )
  }

  const logo_path = event.logo_path ? (event.logo_path.startsWith("http") ? event.logo_path : process.env.NEXT_PUBLIC_API_URL + "/" + event.logo_path) : null
  const poster_path = event.poster_path ? (event.poster_path.startsWith("http") ? event.poster_path : process.env.NEXT_PUBLIC_API_URL + "/" +event.poster_path) : null

  // Map API response to our EventData interface
  const initialData: EventData = {
    id: event.id,
    user_id: session.user.id,
    status: "DRAFT",
    name: event.name || null,
    organizer: event.organizer || null,
    description: event.description || null,
    open_date: event.open_date || null,
    close_date: event.close_date || null,
    compe_date: event.compe_date || event.pelaksanaan_lomba || null,
    location: event.location || null,
    min_team_members: event.min_team_members || event.min_anggota || 0,
    max_team_members: event.max_team_members || event.max_anggota || 0,
    no_wa_pj: event.no_wa_pj || event.wa_panitia || null,
    name_pj: event.name_pj || event.nama_pj || event.penanggung_jawab || null,
    wa_group: event.wa_group || event.link_grup_wa || null,
    bank_name: event.bank_name || null,
    bank_number: event.bank_number || event.nomor_rekening || null,
    logo_path: logo_path,
    poster_path: poster_path,
    levels: (event.event_levels || []).map((l: any) => ({
      id: l.id,
      name: l.name,
      regis_fee: l.regis_fee,
      dp_fee: l.dp_fee,
      registered: l.registered,
      remaining: l.remaining,
      total_quota: l.total_quota
    }))
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-6">
          <Link
            href="/organizer/dashboard"
            className="flex w-fit items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-montserrat text-base font-semibold md:text-lg">
              Kembali
            </span>
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
              My Event
            </h1>
          </div>
        </div>

        {/* INTERACTIVE FORM COMPONENT */}
        <OrganizerEventForm initialData={initialData} />
      </div>
    </div>
  )
}
