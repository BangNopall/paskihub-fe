"use client"

import React, { useState, useEffect } from "react"
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpRight
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Montserrat, Poppins } from "@/lib/fonts"

// Mock Data for Super Admin
const MOCK_ADMIN_DATA = {
  stats: {
    totalRevenue: 125000000,
    totalEO: 42,
    totalParticipants: 1240,
    totalEvents: 15,
    pendingTopups: 8
  },
  recentTransactions: [
    { id: "TX-001", eo: "SMA 1 Jakarta", amount: 500000, coins: 500, time: "10 menit yang lalu", status: "Pending" },
    { id: "TX-002", eo: "Paskibra Kota Bandung", amount: 1000000, coins: 1000, time: "1 jam yang lalu", status: "Approved" },
    { id: "TX-003", eo: "Event Pro Nusantara", amount: 2500000, coins: 2500, time: "3 jam yang lalu", status: "Pending" },
  ],
  eoRegistrations: [
    { id: "EO-101", name: "Lomba Jaya Abadi", email: "contact@lomajaya.com", date: "24 Apr 2026", status: "Verified" },
    { id: "EO-102", name: "Paski Creative", email: "admin@paskicreative.id", date: "26 Apr 2026", status: "Unverified" },
  ]
}

export default function SuperAdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`flex flex-1 flex-col p-4 md:p-6 lg:p-8 ${Poppins.className}`}>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold text-slate-900 ${Montserrat.className}`}>Super Admin Overview</h1>
          <p className="text-neutral-500">Monitor performa platform PaskiHub secara real-time.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Pendapatan" 
            value={formatRupiah(MOCK_ADMIN_DATA.stats.totalRevenue)} 
            icon={<TrendingUp className="text-emerald-500" />} 
            trend="+12% bulan ini"
            isLoading={isLoading}
          />
          <StatCard 
            title="Total EO" 
            value={MOCK_ADMIN_DATA.stats.totalEO} 
            icon={<Users className="text-blue-500" />} 
            trend="+5 baru"
            isLoading={isLoading}
          />
          <StatCard 
            title="Total Peserta" 
            value={MOCK_ADMIN_DATA.stats.totalParticipants} 
            icon={<Users className="text-orange-500" />} 
            trend="+156 baru"
            isLoading={isLoading}
          />
          <StatCard 
            title="Pending Top-up" 
            value={MOCK_ADMIN_DATA.stats.pendingTopups} 
            icon={<CreditCard className="text-red-500" />} 
            trend="Perlu approval"
            isLoading={isLoading}
            highlight={MOCK_ADMIN_DATA.stats.pendingTopups > 0}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pending Transactions Section */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100">
              <div>
                <CardTitle className="text-lg font-semibold">Top-up Perlu Approval</CardTitle>
                <CardDescription>Verifikasi bukti transfer dari EO</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                Lihat Semua <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {MOCK_ADMIN_DATA.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-800">{tx.eo}</span>
                      <span className="text-xs text-neutral-500">{tx.time} • {tx.coins} Koin</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-700">{formatRupiah(tx.amount)}</span>
                      {tx.status === "Pending" ? (
                        <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100 border-none px-3">Pending</Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none px-3">Approved</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New EO Registrations */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100">
              <div>
                <CardTitle className="text-lg font-semibold">Pendaftaran EO Baru</CardTitle>
                <CardDescription>Event Organizer yang baru bergabung</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                Kelola User <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {MOCK_ADMIN_DATA.eoRegistrations.map((eo) => (
                  <div key={eo.id} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-800">{eo.name}</span>
                      <span className="text-xs text-neutral-500">{eo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400">{eo.date}</span>
                      {eo.status === "Verified" ? (
                        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none">Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="text-neutral-400 border-neutral-200">Unverified</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend, isLoading, highlight = false }: any) {
  if (isLoading) return <Skeleton className="h-32 w-full rounded-2xl" />
  
  return (
    <Card className={`rounded-2xl border-neutral-200 shadow-sm transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-neutral-500">{title}</CardTitle>
          <div className="rounded-lg bg-neutral-100 p-2">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <span className={`text-2xl font-bold text-slate-900 ${Montserrat.className}`}>{value}</span>
          <span className="mt-1 text-xs text-neutral-400">{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}
