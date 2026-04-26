"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  Users,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export interface DashboardStats {
  totalEvent: {
    value: number
    trend: string
  }
  totalTeam: {
    value: number
    trend: string
  }
  coinBalance: {
    value: number // Nilai dalam Rupiah
    coins: number // Nilai dalam Koin
  }
  revenue: {
    value: number
    trend: string
  }
}

export type ActivityStatus = "Perlu Review" | "Selesai"

export interface RecentActivity {
  id: string
  teamName: string
  eventName: string
  timeAgo: string
  status: ActivityStatus
}

export type UpcomingEventStatus =
  | "Buka Pendaftaran"
  | "Tutup"
  | "Sedang Berjalan"

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  registeredTeams: number
  status: UpcomingEventStatus
}

export interface OrganizerDashboardData {
  stats: DashboardStats
  recentActivities: RecentActivity[]
  upcomingEvents: UpcomingEvent[]
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_DASHBOARD_DATA: OrganizerDashboardData = {
  stats: {
    totalEvent: { value: 3, trend: "+1 bulan ini" },
    totalTeam: { value: 47, trend: "+12 minggu ini" },
    coinBalance: { value: 250000, coins: 250 },
    revenue: { value: 35250000, trend: "+15% bulan ini" },
  },
  recentActivities: [
    {
      id: "act-1",
      teamName: "Paskibra Elang Jaya",
      eventName: "Lomba Paskibra Nasional 2026",
      timeAgo: "2 menit yang lalu",
      status: "Perlu Review",
    },
    {
      id: "act-2",
      teamName: "Paskibra Garuda Muda",
      eventName: "Festival Paskibra Regional",
      timeAgo: "15 menit yang lalu",
      status: "Selesai", // Asumsi ada status selain Perlu Review
    },
    {
      id: "act-3",
      teamName: "Paskibra Merah Putih",
      eventName: "Pekan Paskibra Nusantara",
      timeAgo: "1 jam yang lalu",
      status: "Perlu Review",
    },
  ],
  upcomingEvents: [
    {
      id: "evt-1",
      title: "Lomba Paskibra Nasional 2026",
      date: "15 Maret 2026",
      registeredTeams: 18,
      status: "Buka Pendaftaran",
    },
    {
      id: "evt-2",
      title: "Festival Paskibra Regional Jawa Barat",
      date: "20 April 2026",
      registeredTeams: 15,
      status: "Buka Pendaftaran", // Asumsi berdasarkan UI default
    },
    {
      id: "evt-3",
      title: "Pekan Paskibra Nusantara",
      date: "10 Mei 2026",
      registeredTeams: 14,
      status: "Buka Pendaftaran",
    },
  ],
}

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function ActivityBadge({ status }: { status: ActivityStatus }) {
  if (status === "Perlu Review") {
    return (
      <Badge
        variant="outline"
        className="border-yellow-400 bg-yellow-50 px-3 py-1 font-poppins text-xs font-normal text-yellow-600"
      >
        Perlu Review
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="border-green-400 bg-green-50 px-3 py-1 font-poppins text-xs font-normal text-green-600"
    >
      {status}
    </Badge>
  )
}

function EventStatusBadge({ status }: { status: UpcomingEventStatus }) {
  if (status === "Buka Pendaftaran") {
    return (
      <Badge
        variant="outline"
        className="border-green-400 bg-emerald-50 px-3 py-1 font-poppins text-xs font-normal text-green-600"
      >
        Buka Pendaftaran
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="border-neutral-300 bg-neutral-50 px-3 py-1 font-poppins text-xs font-normal text-neutral-600"
    >
      {status}
    </Badge>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function OrganizerDashboardPage() {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState<OrganizerDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/dashboard di sini
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulasi network delay

        // Asumsi data berhasil di-fetch
        setData(MOCK_DASHBOARD_DATA)
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // --- ERROR STATE UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <p className="mt-2 font-poppins text-sm text-neutral-500">
          Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat text-2xl leading-9 font-bold text-slate-900 md:text-3xl">
            Dashboard Overview
          </h1>
        </div>

        {/* LOADING SKELETON OR ACTUAL CONTENT */}
        {isLoading || !data ? (
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Stats Skeletons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
            {/* Sections Skeletons */}
            <div className="flex flex-col gap-6">
              <Skeleton className="h-80 w-full rounded-3xl" />
              <Skeleton className="h-80 w-full rounded-3xl" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
            {/* =========================================
                SECTION 1: STATS CARDS
                ========================================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Event */}
              <Card className="rounded-2xl border-gray-200 bg-white shadow-none">
                <CardHeader>
                  <CardTitle className="font-poppins text-sm font-normal text-neutral-700">
                    Total Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <span className="font-poppins text-2xl font-bold text-neutral-700 md:text-3xl">
                      {data.stats.totalEvent.value}
                    </span>
                    <span className="font-poppins text-xs font-normal text-neutral-500">
                      {data.stats.totalEvent.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Tim Terdaftar */}
              <Card className="rounded-2xl border-gray-200 bg-white shadow-none">
                <CardHeader>
                  <CardTitle className="font-poppins text-sm font-normal text-neutral-700">
                    Total Tim Terdaftar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <span className="font-poppins text-2xl font-bold text-neutral-700 md:text-3xl">
                      {data.stats.totalTeam.value}
                    </span>
                    <span className="font-poppins text-xs font-normal text-neutral-500">
                      {data.stats.totalTeam.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Saldo Koin */}
              <Card className="rounded-2xl border-gray-200 bg-white shadow-none">
                <CardHeader>
                  <CardTitle className="font-poppins text-sm font-normal text-neutral-700">
                    Saldo Koin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <span className="font-poppins text-2xl font-bold text-neutral-700 md:text-3xl">
                      {data.stats.coinBalance.value.toLocaleString("id-ID")}
                    </span>
                    <span className="font-poppins text-xs font-normal text-neutral-500">
                      {data.stats.coinBalance.coins} Koin
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Pendapatan */}
              <Card className="rounded-2xl border-gray-200 bg-white shadow-none">
                <CardHeader>
                  <CardTitle className="font-poppins text-sm font-normal text-neutral-700">
                    Pendapatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <span className="truncate font-poppins text-2xl font-bold text-neutral-700 md:text-3xl">
                      {formatRupiah(data.stats.revenue.value)}
                    </span>
                    <span className="font-poppins text-xs font-normal text-neutral-500">
                      {data.stats.revenue.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* =========================================
                SECTION 2: AKTIVITAS TERBARU
                ========================================= */}
            <Card className="overflow-hidden rounded-[24px] border-gray-200 shadow-sm">
              <CardHeader className="border-b border-neutral-100 bg-white px-5 md:px-6">
                <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">
                  Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 bg-white px-5 md:px-6">
                {data.recentActivities.length === 0 ? (
                  <div className="py-6 text-center font-poppins text-sm text-neutral-500">
                    Belum ada aktivitas.
                  </div>
                ) : (
                  data.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-base font-semibold text-neutral-800">
                          {activity.teamName}
                        </span>
                        <span className="font-poppins text-sm text-neutral-500">
                          {activity.eventName}
                        </span>
                        <span className="mt-1 font-poppins text-xs text-neutral-400">
                          {activity.timeAgo}
                        </span>
                      </div>
                      <div className="flex shrink-0">
                        {/* Jika Selesai tidak di highlight berlebihan, asumsikan dari Figma */}
                        {activity.status === "Perlu Review" ? (
                          <ActivityBadge status={activity.status} />
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
