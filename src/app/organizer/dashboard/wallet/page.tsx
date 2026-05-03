import React from "react"
import { Coins, Info, AlertCircle } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

import { walletService } from "@/services/wallet.service"
import { profileService } from "@/services/profile.service"
import { WalletTopUpForm } from "@/components/organizer/wallet-topup-form"
import { WalletTransactionTable } from "@/components/organizer/wallet-transaction-table"

// ==========================================
// 1. UI HELPER COMPONENTS
// ==========================================

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// ==========================================
// 2. MAIN PAGE COMPONENT (SERVER SIDE)
// ==========================================

export default async function WalletPage() {
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  // Ambil event pertama user
  const events = await profileService.getEventsByUserId(session.accessToken, session.user.id)
  if (!events || events.length === 0) redirect("/auth/register/eo/data-form")
  const eventId = events[0].id

  // Fetch Data SSR
  const [walletData, transactions, settings] = await Promise.all([
    walletService.getWalletInfo(session.accessToken, eventId),
    walletService.getWalletLogs(session.accessToken, eventId),
    walletService.getPublicSettings(session.accessToken)
  ])

  if (!walletData) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data Wallet
        </h2>
        <p className="mt-2 text-neutral-500">Hubungi admin jika masalah berlanjut.</p>
      </div>
    )
  }

  // console.log(walletData, transactions, settings)

  const coinBalance = walletData.coin_balance || 0
  const coinRate = settings.coin_rate || 0
  
  // Mapping Bank Info
  const bankInfo = {
    bankName: settings.bank_info?.bank_name || null,
    accountNumber: settings.bank_info?.account_number || null,
    accountName: settings.bank_info?.account_name || null
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Wallet
        </h1>

        <div className="flex flex-col gap-8">
          {/* TOP SECTION: SALDO & STATISTIK */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col items-center gap-2">
                <span className="font-poppins text-sm text-neutral-700">Saldo Koin</span>
                <div className="flex items-center gap-2">
                  <Coins className="h-8 w-8 text-neutral-700" />
                  <span className="font-poppins text-3xl font-semibold text-neutral-700 md:text-4xl">
                    {coinBalance.toLocaleString("id-ID")}
                  </span>
                </div>
                <span className="font-poppins text-sm text-neutral-500">
                  ≈ {formatRupiah(coinBalance * coinRate)}
                </span>
              </div>
              <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-indigo-50 px-4 py-3">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="font-poppins text-sm text-blue-500">
                  Nilai 1 Koin = {formatRupiah(coinRate)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-6 shadow-sm lg:col-span-3">
              <h3 className="text-center font-poppins text-lg font-medium text-slate-900 md:text-left">
                Statistik
              </h3>
              <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-50 bg-white p-6 shadow-sm">
                  <span className="font-poppins text-3xl font-semibold text-green-500">
                    {walletData.successful_topup_count || 0}
                  </span>
                  <span className="font-poppins text-sm text-neutral-700">Top Up Berhasil</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-50 bg-white p-6 shadow-sm">
                  <span className="font-poppins text-3xl font-semibold text-amber-400">
                    {walletData.pending_topup_count || 0}
                  </span>
                  <span className="font-poppins text-sm text-neutral-700">Menunggu Approval</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN SECTION: TOP UP FORM */}
          <div className="flex flex-col gap-6 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm md:p-8">
            <h2 className="font-poppins text-lg font-medium text-slate-900">Top Up Koin</h2>
            <WalletTopUpForm eventId={eventId} bankInfo={bankInfo} coinRate={coinRate} />
          </div>

          {/* HISTORY SECTION */}
          <div className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-4 shadow-sm md:p-6">
            <h2 className="font-poppins text-lg font-medium text-slate-900">History Transaksi</h2>
            <WalletTransactionTable transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
