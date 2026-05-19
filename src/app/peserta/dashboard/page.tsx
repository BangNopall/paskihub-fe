import {
  Plus,
  Search,
  CalendarDays,
  Users,
  Eye,
  Bell,
  AlertCircle,
} from "lucide-react"

import type { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Montserrat, Poppins } from "@/lib/fonts"
import { authOptions } from "@/lib/auth"
import {
  ParticipantDashboard,
  ParticipantDashboardActivity,
  ParticipantDashboardUpcomingEvent,
} from "@/schemas/participant-dashboard.schema"
import { participantDashboardService } from "@/services/participant-dashboard.service"
import dashboardPeserta from "@/../public/dashboard/peserta/peserta-beranda.jpg"

function formatEventDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate)
}

function getEventStatusLabel(status: string) {
  switch (status) {
    case "OPEN":
      return "Buka Pendaftaran"
    case "CLOSED":
      return "Tutup"
    case "DRAFT":
      return "Draft"
    case "ARCHIVED":
      return "Diarsipkan"
    case "FINISHED":
      return "Selesai"
    default:
      return status
  }
}

function DashboardErrorState() {
  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex min-h-[420px] w-full max-w-6xl flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-neutral-900">
          Gagal Memuat Data
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Terjadi kesalahan saat memuat dashboard. Silakan coba lagi nanti.
        </p>
        <Button asChild className="mt-6 rounded-lg bg-info-600 text-white">
          <Link href="/peserta/dashboard">Muat Ulang</Link>
        </Button>
      </div>
    </div>
  )
}

function DashboardContent({ data }: { data: ParticipantDashboard }) {
  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:p-6 lg:p-8">
          {/* --- 1. HERO BANNER SECTION --- */}
          <div className="relative flex w-full flex-col items-start justify-center gap-4 overflow-hidden rounded-2xl bg-info-600 p-8 sm:p-12 lg:p-16">
            {/* Latar Belakang Dekoratif (Bisa diganti dengan Image Next.js) */}
            <Image
              src={dashboardPeserta}
              alt="Dashboard Peserta"
              fill
              className="object-cover opacity-30"
            />

            {/* Konten Banner */}
            <div className="relative z-10 flex w-full max-w-3xl flex-col items-start justify-start gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl leading-tight font-semibold text-white sm:text-3xl md:text-4xl">
                  Selamat Datang di Portal Lomba Paskibra
                </h1>
                <p className="text-sm font-medium text-primary-100 sm:text-base">
                  Platform pendaftaran dan manajemen tim untuk kompetisi Pasukan
                  Pengibar Bendera seluruh Indonesia
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-lg bg-white px-6 text-info-600 hover:bg-neutral-100"
                >
                  <Link href="/peserta/dashboard/team/new">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Buat Tim Baru</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <Link href="/peserta/dashboard/event">
                    <Search className="mr-2 h-4 w-4" />
                    <span>Lihat Event</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* --- 2. STATISTIK CARDS --- */}
          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="Total Tim" value={data.stats.total_team} />
            <StatCard title="Event Aktif" value={data.stats.active_event} />
            <StatCard title="Event Selesai" value={data.stats.finished_event} />
            <StatCard
              title="Pembayaran Pending"
              value={data.stats.pending_payment}
            />
          </div>

          {/* --- 3. KONTEN BAWAH (Grid 2 Kolom di Desktop) --- */}
          <div className="flex w-full flex-col gap-6">
            {/* KOLOM KIRI: Aktivitas Terbaru (Lebih Lebar) */}
            <Card className="col-span-1 flex flex-col border-neutral-200 shadow-sm lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100">
                <CardTitle className="text-lg font-semibold text-neutral-800">
                  Aktivitas Terbaru
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="border border-info-200 bg-info-50 px-3 py-1 font-normal text-info-600 hover:bg-info-100"
                >
                  <Bell className="mr-1.5 h-3 w-3" />{" "}
                  {data.recent_activities.length} Notifikasi
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-4 sm:px-6">
                {data.recent_activities.length === 0 ? (
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                    Belum ada aktivitas terbaru.
                  </div>
                ) : (
                  data.recent_activities.map((activity) => (
                    <ActivityItem
                      key={`${activity.title}-${activity.time}`}
                      activity={activity}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* KOLOM KANAN: Event Mendatang */}
            <Card className="col-span-1 flex flex-col border-neutral-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100">
                <CardTitle className="text-lg font-semibold text-neutral-800">
                  Event Mendatang
                </CardTitle>
                <Link
                  href="/peserta/dashboard/event"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Lihat Semua
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 px-4 sm:px-6">
                {data.upcoming_events.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                    Belum ada event mendatang.
                  </div>
                ) : (
                  data.upcoming_events.map((event) => (
                    <UpcomingEventItem key={event.id} event={event} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function PesertaDashboardPage() {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.accessToken) {
    redirect("/auth/login")
  }

  let dashboardData: ParticipantDashboard | null = null

  try {
    dashboardData = await participantDashboardService.getDashboard(
      session.accessToken
    )
  } catch {
    dashboardData = null
  }

  if (!dashboardData) {
    return <DashboardErrorState />
  }

  return <DashboardContent data={dashboardData} />
}

// 1. Kotak Statistik Kecil
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-primary-200 hover:shadow-md sm:p-5">
      <span className="text-sm leading-tight font-medium text-neutral-500">
        {title}
      </span>
      <span
        className={`text-3xl font-bold text-neutral-800 ${Montserrat.className}`}
      >
        {value}
      </span>
    </div>
  )
}

// 2. Baris Aktivitas
function ActivityItem({
  activity,
}: {
  activity: ParticipantDashboardActivity
}) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4 transition-colors hover:bg-neutral-100/70 sm:flex-row sm:items-start">
      <div className="flex items-start gap-3">
        {/* Teks */}
        <div className="flex flex-col gap-1">
          <span className="text-sm leading-tight font-semibold text-neutral-800">
            {activity.title}
          </span>
          <span className="text-xs leading-snug font-normal text-neutral-500">
            {activity.description}
          </span>
        </div>
      </div>

      {/* Waktu (Geser ke kanan di desktop, di bawah teks di mobile) */}
      <span className="pl-11 text-xs font-medium text-neutral-400 sm:shrink-0 sm:pt-1 sm:pl-0">
        {activity.time}
      </span>
    </div>
  )
}

function UpcomingEventItem({
  event,
}: {
  event: ParticipantDashboardUpcomingEvent
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 transition-colors hover:bg-neutral-100/70">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-base leading-tight font-semibold text-neutral-800">
              {event.title}
            </h3>
            <Badge
              variant="outline"
              className="w-fit border-info-200 bg-info-50 px-3 py-1 text-xs font-normal text-info-600"
            >
              {getEventStatusLabel(event.status)}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <CalendarDays className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Users className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>{event.registered_teams} tim terdaftar</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        asChild
        variant="outline"
        className="w-full border-neutral-300 font-medium text-neutral-700 hover:bg-neutral-50"
      >
        <Link href={`/peserta/dashboard/event/${event.detail_url_id}/overview`}>
          <Eye className="mr-2 h-4 w-4" />
          Lihat Detail
        </Link>
      </Button>
    </div>
  )
}
