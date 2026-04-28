"use client"

import React, { useState, useEffect } from "react"
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  AlertCircle,
  ArrowUpRight,
  UserCheck
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Montserrat, Poppins } from "@/lib/fonts"
import Link from "next/link"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export interface AdminStats {
  totalRevenue: number
  totalEO: number
  totalParticipants: number
  pendingTopups: number
}

export interface RecentTransaction {
  id: string
  eo: string
  amount: number
  coins: number
  time: string
  status: "Pending" | "Approved" | "Rejected"
}

export interface EORegistration {
  id: string
  name: string
  email: string
  date: string
}

export interface SuperAdminDashboardData {
  stats: AdminStats
  recentTransactions: RecentTransaction[]
  eoRegistrations: EORegistration[]
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_ADMIN_DATA: SuperAdminDashboardData = {
  stats: {
    totalRevenue: 125000000,
    totalEO: 42,
    totalParticipants: 1240,
    pendingTopups: 8
  },
  recentTransactions: [
    { id: "TX-001", eo: "SMA 1 Jakarta", amount: 500000, coins: 500, time: "10 menit yang lalu", status: "Pending" },
    { id: "TX-002", eo: "Paskibra Kota Bandung", amount: 1000000, coins: 1000, time: "1 jam yang lalu", status: "Approved" },
    { id: "TX-003", eo: "Event Pro Nusantara", amount: 2500000, coins: 2500, time: "3 jam yang lalu", status: "Pending" },
  ],
  eoRegistrations: [
    { id: "EO-101", name: "Lomba Jaya Abadi", email: "contact@lomajaya.com", date: "24 Apr 2026" },
    { id: "EO-102", name: "Paski Creative", email: "admin@paskicreative.id", date: "26 Apr 2026" },
  ]
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "border-yellow-400 bg-yellow-50 text-yellow-600",
    Approved: "border-green-400 bg-green-50 text-green-600",
    Verified: "border-blue-400 bg-blue-50 text-blue-600",
    Unverified: "border-neutral-300 bg-neutral-50 text-neutral-600",
  }

  return (
    <Badge variant="outline" className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status] || ""}`}>
      {status}
    </Badge>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<SuperAdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/admin/dashboard di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setData(MOCK_ADMIN_DATA)
      } catch (error) {
        console.error("Gagal memuat data admin:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">Gagal Memuat Data</h2>
        <Button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600">
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Super Admin Overview
          </h1>
          <p className="text-sm text-neutral-500">Monitor performa platform PaskiHub secara real-time.</p>
        </div>

        {isLoading || !data ? (
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Skeleton className="h-80 w-full rounded-3xl" />
              <Skeleton className="h-80 w-full rounded-3xl" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Pendapatan" value={formatRupiah(data.stats.totalRevenue)} icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} trend="+12% bulan ini" />
              <StatCard title="Total EO" value={data.stats.totalEO} icon={<Users className="h-5 w-5 text-blue-500" />} trend="+5 baru" />
              <StatCard title="Total Peserta" value={data.stats.totalParticipants} icon={<UserCheck className="h-5 w-5 text-orange-500" />} trend="+156 baru" />
              <StatCard title="Pending Top-up" value={data.stats.pendingTopups} icon={<CreditCard className="h-5 w-5 text-red-500" />} trend="Perlu approval" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* TRANSACTIONS */}
              <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
                <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 px-5 md:px-6">
                  <div>
                    <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">Top-up Approval</CardTitle>
                  </div>
                  <Link href="/admin/dashboard/transactions" className="text-info-600 flex gap-2 items-center">
                    <span>Lihat Semua</span>
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 px-5 md:px-6">
                  {data.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-base font-semibold text-neutral-800">{tx.eo}</span>
                        <span className="text-xs text-neutral-500">{tx.time} • {tx.coins} Koin</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-700">{formatRupiah(tx.amount)}</span>
                        <StatusBadge status={tx.status} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* EO REGISTRATIONS */}
              <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
                <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 px-5 md:px-6">
                  <div>
                    <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">EO Baru</CardTitle>
                  </div>
                  <Link href="/admin/dashboard/users" className="text-info-600 flex gap-2 items-center">
                    <span>Kelola User</span>
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 px-5 md:px-6">
                  {data.eoRegistrations.map((eo) => (
                    <div key={eo.id} className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-base font-semibold text-neutral-800">{eo.name}</span>
                        <span className="text-xs text-neutral-500">{eo.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-neutral-400">{eo.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card className={`rounded-2xl border-gray-200 bg-white shadow-none transition-all hover:border-sky-200`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-poppins text-sm font-normal text-neutral-700">{title}</CardTitle>
          <div className="rounded-lg bg-neutral-50 p-2">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="font-poppins text-2xl font-bold text-neutral-800">{value}</span>
          <span className="font-poppins text-xs font-normal text-neutral-500">{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}
