import React from "react"
import {
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  UserCheck,
} from "lucide-react"
import type { Session } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Poppins } from "@/lib/fonts"
import { authOptions } from "@/lib/auth"
import {
  AdminDashboard,
  AdminDashboardEORegistration,
  AdminDashboardTransaction,
} from "@/schemas/admin-dashboard.schema"
import { adminDashboardService } from "@/services/admin-dashboard.service"

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

function formatDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate)
}

function getTransactionStatusLabel(
  status: AdminDashboardTransaction["status"]
) {
  switch (status) {
    case "APPROVE":
      return "Approved"
    case "REJECTED":
      return "Rejected"
    default:
      return "Pending"
  }
}

function StatusBadge({
  status,
}: {
  status: AdminDashboardTransaction["status"]
}) {
  const styles: Record<AdminDashboardTransaction["status"], string> = {
    PENDING: "border-yellow-400 bg-yellow-50 text-yellow-600",
    APPROVE: "border-green-400 bg-green-50 text-green-600",
    REJECTED: "border-red-400 bg-red-50 text-red-600",
  }

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status]}`}
    >
      {getTransactionStatusLabel(status)}
    </Badge>
  )
}

function DashboardErrorState() {
  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex min-h-[420px] w-full max-w-7xl flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Terjadi kesalahan saat memuat dashboard admin. Silakan coba lagi
          nanti.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          <Link href="/admin/dashboard">Muat Ulang</Link>
        </Button>
      </div>
    </div>
  )
}

function RecentTransactionItem({
  transaction,
}: {
  transaction: AdminDashboardTransaction
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <span className="font-poppins text-base font-semibold text-neutral-800">
          {transaction.eo_name}
        </span>
        <span className="text-xs text-neutral-500">
          {transaction.time_ago} • {transaction.amount_koin} Koin
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-neutral-700">
          {formatRupiah(transaction.amount)}
        </span>
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  )
}

function EORegistrationItem({
  registration,
}: {
  registration: AdminDashboardEORegistration
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <span className="font-poppins text-base font-semibold text-neutral-800">
          {registration.name}
        </span>
        <span className="text-xs text-neutral-500">{registration.email}</span>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-neutral-400">
          {formatDate(registration.registered_at)}
        </span>
      </div>
    </div>
  )
}

function DashboardContent({ data }: { data: AdminDashboard }) {
  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Super Admin Overview
          </h1>
          <p className="text-sm text-neutral-500">
            Monitor performa platform PaskiHub secara real-time.
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Pendapatan"
              value={formatRupiah(data.stats.total_revenue.value)}
              icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
              trend={data.stats.total_revenue.trend}
            />
            <StatCard
              title="Total EO"
              value={data.stats.total_eo.value}
              icon={<Users className="h-5 w-5 text-blue-500" />}
              trend={data.stats.total_eo.trend}
            />
            <StatCard
              title="Total Peserta"
              value={data.stats.total_participants.value}
              icon={<UserCheck className="h-5 w-5 text-orange-500" />}
              trend={data.stats.total_participants.trend}
            />
            <StatCard
              title="Pending Top-up"
              value={data.stats.pending_topups.value}
              icon={<CreditCard className="h-5 w-5 text-red-500" />}
              trend={data.stats.pending_topups.trend}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 px-5 md:px-6">
                <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">
                  Top-up Approval
                </CardTitle>
                <Link
                  href="/admin/dashboard/transactions"
                  className="flex items-center gap-2 text-info-600"
                >
                  <span>Lihat Semua</span>
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-5 md:px-6">
                {data.recent_transactions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                    Belum ada transaksi top-up terbaru.
                  </div>
                ) : (
                  data.recent_transactions.map((transaction) => (
                    <RecentTransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 px-5 md:px-6">
                <CardTitle className="font-poppins text-lg font-semibold text-neutral-800">
                  EO Baru
                </CardTitle>
                <Link
                  href="/admin/dashboard/users"
                  className="flex items-center gap-2 text-info-600"
                >
                  <span>Kelola User</span>
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-5 md:px-6">
                {data.eo_registrations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                    Belum ada registrasi EO terbaru.
                  </div>
                ) : (
                  data.eo_registrations.map((registration) => (
                    <EORegistrationItem
                      key={registration.id}
                      registration={registration}
                    />
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

export default async function SuperAdminDashboardPage() {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.accessToken) {
    redirect("/auth/login")
  }

  let dashboardData: AdminDashboard | null = null

  try {
    dashboardData = await adminDashboardService.getDashboard(
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

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  trend: string
}) {
  return (
    <Card
      className={`rounded-2xl border-gray-200 bg-white shadow-none transition-all hover:border-sky-200`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-poppins text-sm font-normal text-neutral-700">
            {title}
          </CardTitle>
          <div className="rounded-lg bg-neutral-50 p-2">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="font-poppins text-2xl font-bold text-neutral-800">
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
