/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import type { Session } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import {
  OrganizerDashboard,
  OrganizerDashboardActivity,
  OrganizerDashboardUpcomingEvent,
} from "@/schemas/organizer-dashboard.schema"
import { organizerDashboardService } from "@/services/organizer-dashboard.service"

type ActivityTone = "pending" | "approved" | "rejected" | "neutral"

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

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

function getActivityStatus(status: string): {
  label: string
  tone: ActivityTone
} {
  switch (status) {
    case "WAITING":
      return { label: "Perlu Review", tone: "pending" }
    case "DP_PAID":
    case "FULL_PAID":
      return { label: "Approved", tone: "approved" }
    case "REJECTED":
    case "KICKED":
      return { label: "Rejected", tone: "rejected" }
    default:
      return { label: status, tone: "neutral" }
  }
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
    default:
      return status
  }
}

function ActivityBadge({ status }: { status: string }) {
  const { label, tone } = getActivityStatus(status)

  const classNameByTone: Record<ActivityTone, string> = {
    pending:
      "border-yellow-400 bg-yellow-50 text-yellow-600 hover:bg-yellow-50",
    approved:
      "border-green-400 bg-emerald-50 text-green-600 hover:bg-emerald-50",
    rejected: "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-50",
    neutral:
      "border-neutral-300 bg-neutral-50 text-neutral-600 hover:bg-neutral-50",
  }

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-poppins text-xs font-normal ${classNameByTone[tone]}`}
    >
      {label}
    </Badge>
  )
}

function EventStatusBadge({ status }: { status: string }) {
  const isOpen = status === "OPEN"

  return (
    <Badge
      variant="outline"
      className={
        isOpen
          ? "border-green-400 bg-emerald-50 px-3 py-1 font-poppins text-xs font-normal text-green-600"
          : "border-neutral-300 bg-neutral-50 px-3 py-1 font-poppins text-xs font-normal text-neutral-600"
      }
    >
      {getEventStatusLabel(status)}
    </Badge>
  )
}

function StatCard({
  title,
  value,
  trend,
}: {
  title: string
  value: React.ReactNode
  trend: string
}) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white shadow-none">
      <CardHeader>
        <CardTitle className="font-poppins text-sm font-normal text-neutral-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="truncate font-poppins text-2xl font-bold text-neutral-700 md:text-3xl">
            {value}
          </span>
          <span className="font-poppins text-xs font-normal text-neutral-500">
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivityItem({
  activity,
}: {
  activity: OrganizerDashboardActivity
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <span className="font-poppins text-base font-semibold text-neutral-800">
          {activity.team_name}
        </span>
        <span className="font-poppins text-sm text-neutral-500">
          Baru mendaftar ke {activity.event_name}
        </span>
        <span className="mt-1 font-poppins text-xs text-neutral-400">
          {activity.time_ago}
        </span>
      </div>
      <div className="flex shrink-0">
        <ActivityBadge status={activity.status} />
      </div>
    </div>
  )
}

function UpcomingEventItem({
  event,
}: {
  event: OrganizerDashboardUpcomingEvent
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-poppins text-base font-semibold text-neutral-800">
            {event.title}
          </span>
          <div className="flex flex-col gap-2 font-poppins text-sm text-neutral-500 sm:flex-row sm:items-center sm:gap-4">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              {formatEventDate(event.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-neutral-400" />
              {event.registered_teams} tim terdaftar
            </span>
          </div>
        </div>
        <div className="flex">
          <EventStatusBadge status={event.status} />
        </div>
      </div>
      <Button
        asChild
        variant="outline"
        className="w-full border-neutral-300 font-medium text-neutral-700 hover:bg-neutral-50 sm:w-auto"
      >
        <Link href="/organizer/dashboard/event">
          Detail
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

function DashboardContent({ data }: { data: OrganizerDashboard }) {
  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Event"
          value={data.stats.total_event.value}
          trend={data.stats.total_event.trend}
        />
        <StatCard
          title="Total Tim Terdaftar"
          value={data.stats.total_team.value}
          trend={data.stats.total_team.trend}
        />
        <StatCard
          title="Saldo Koin"
          value={data.stats.coin_balance.value.toLocaleString("id-ID")}
          trend={`${data.stats.coin_balance.coins.toLocaleString("id-ID")} Koin`}
        />
        <StatCard
          title="Pendapatan"
          value={formatRupiah(data.stats.revenue.value)}
          trend={data.stats.revenue.trend}
        />
      </div>

      <Card className="overflow-hidden rounded-[24px] border-gray-200 shadow-sm">
        <CardHeader className="border-b border-neutral-100 bg-white px-5 md:px-6">
          <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 bg-white px-5 md:px-6">
          {data.recent_activities.length === 0 ? (
            <div className="py-6 text-center font-poppins text-sm text-neutral-500">
              Belum ada tim yang mendaftar.
            </div>
          ) : (
            data.recent_activities.map((activity) => (
              <RecentActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[24px] border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 bg-white px-5 md:px-6">
          <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">
            Event Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 bg-white px-5 md:px-6">
          {data.upcoming_events.length === 0 ? (
            <div className="py-6 text-center font-poppins text-sm text-neutral-500">
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
  )
}

function DashboardErrorState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h2 className="font-montserrat text-xl font-bold text-slate-900">
        Gagal Memuat Data
      </h2>
      <p className="mt-2 font-poppins text-sm text-neutral-500">
        Terjadi kesalahan saat memuat dashboard. Silakan coba lagi nanti.
      </p>
      <Button
        asChild
        className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600"
      >
        <Link href="/organizer/dashboard">Muat Ulang</Link>
      </Button>
    </div>
  )
}

export default async function OrganizerDashboardPage() {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.accessToken) {
    redirect("/auth/login")
  }

  let dashboardData: OrganizerDashboard | null = null

  try {
    dashboardData = await organizerDashboardService.getDashboard(
      session.accessToken
    )
  } catch {
    dashboardData = null
  }

  if (!dashboardData) {
    return <DashboardErrorState />
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-montserrat text-2xl leading-9 font-bold text-slate-900 md:text-3xl">
              Dashboard Overview
            </h1>
          </div>
        </div>

        <DashboardContent data={dashboardData} />
      </div>
    </div>
  )
}
