"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Coins,
  UploadCloud,
  FileText,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export interface WalletStats {
  coinBalance: number
  coinRate: number // Contoh: 1 koin = 1000 rupiah
  successfulTopUps: number
  pendingApprovals: number
}

export interface BankInfo {
  bankName: string
  accountNumber: string
  accountName: string
}

export type TransactionStatus = "Pending" | "Approved" | "Pengurangan"

export interface TransactionHistory {
  id: string
  type: string
  date: string
  time: string
  coinAmount: number
  status: TransactionStatus
}

export interface TopUpPayload {
  amount: number
  couponCode?: string
  paymentProof: File | null
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_STATS: WalletStats = {
  coinBalance: 150,
  coinRate: 1000,
  successfulTopUps: 2,
  pendingApprovals: 1,
}

const MOCK_BANK_INFO: BankInfo = {
  bankName: "BCA",
  accountNumber: "1234567890",
  accountName: "Panitia Lomba GJ 2025",
}

const MOCK_TRANSACTIONS: TransactionHistory[] = [
  {
    id: "tx-1",
    type: "Top Up",
    date: "12 Januari 2026",
    time: "14:30",
    coinAmount: 100,
    status: "Pending",
  },
  {
    id: "tx-2",
    type: "Approve Peserta",
    date: "12 Januari 2026",
    time: "14:30",
    coinAmount: -1,
    status: "Pengurangan",
  },
  {
    id: "tx-3",
    type: "Top Up",
    date: "12 Januari 2026",
    time: "14:30",
    coinAmount: 150,
    status: "Approved",
  },
  {
    id: "tx-4",
    type: "Approve Peserta",
    date: "12 Januari 2026",
    time: "14:30",
    coinAmount: -1,
    status: "Pengurangan",
  },
  {
    id: "tx-5",
    type: "Approve Peserta",
    date: "12 Januari 2026",
    time: "14:30",
    coinAmount: -1,
    status: "Pengurangan",
  },
  {
    id: "tx-6",
    type: "Top Up",
    date: "12 Januari 2026",
    time: "14:30",
    coinAmount: 250,
    status: "Approved",
  },
]

const TOP_UP_OPTIONS = [
  { id: 1, coins: 50, price: 50000 },
  { id: 2, coins: 100, price: 100000 },
  { id: 3, coins: 150, price: 150000 },
  { id: 4, coins: 200, price: 200000 },
]

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

function TransactionBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-yellow-400 bg-yellow-50 px-3 py-1 font-poppins text-xs font-normal text-yellow-600"
        >
          Pending
        </Badge>
      )
    case "Approved":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-green-400 bg-emerald-50 px-3 py-1 font-poppins text-xs font-normal text-green-600"
        >
          Approved
        </Badge>
      )
    case "Pengurangan":
      return (
        <Badge
          variant="outline"
          className="w-28 justify-center border-stone-300 bg-gray-50 px-3 py-1 font-poppins text-xs font-normal text-stone-400"
        >
          Pengurangan
        </Badge>
      )
    default:
      return null
  }
}

function SectionWrapper({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6",
        className
      )}
    >
      {title && (
        <h3 className="font-poppins text-lg font-medium text-slate-900">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function WalletPage() {
  // --- DATA STATE ---
  const [stats, setStats] = useState<WalletStats | null>(null)
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
  const [transactions, setTransactions] = useState<TransactionHistory[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // --- FORM STATE ---
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [couponCode, setCouponCode] = useState<string>("")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- FETCH DATA SIMULATION ---
  useEffect(() => {
    const fetchWalletData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/wallet di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStats(MOCK_STATS)
        setBankInfo(MOCK_BANK_INFO)
        setTransactions(MOCK_TRANSACTIONS)
      } catch (error) {
        console.error("Gagal memuat data wallet:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWalletData()
  }, [])

  // --- HANDLERS ---
  const handleOptionSelect = (coins: number) => {
    setSelectedOption(coins)
    setCustomAmount("") // Clear custom if predefined is selected
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedOption(null) // Clear predefined if custom is typed
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleSubmitTopUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const finalAmount = selectedOption || parseInt(customAmount)

    if (!finalAmount || finalAmount <= 0) {
      alert("Pilih atau masukkan jumlah koin yang valid.")
      return
    }
    if (!paymentProof) {
      alert("Harap unggah bukti transfer.")
      return
    }

    setIsSubmitting(true)

    const payload: TopUpPayload = {
      amount: finalAmount,
      couponCode: couponCode || undefined,
      paymentProof: paymentProof,
    }

    try {
      // TODO: Integrasi API POST /api/organizer/wallet/topup (Gunakan FormData untuk file)
      console.log("=== PAYLOAD TOP UP ===", payload)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Pengajuan Top Up berhasil dikirim. Menunggu verifikasi admin.")

      // Reset Form
      setSelectedOption(null)
      setCustomAmount("")
      setCouponCode("")
      setPaymentProof(null)

      // Opsional: Refresh transaksi
    } catch (error) {
      console.error("Gagal top up:", error)
      alert("Terjadi kesalahan saat mengajukan Top Up.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- ERROR UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data Wallet
        </h2>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Wallet
        </h1>

        {isLoading || !stats || !bankInfo ? (
          /* SKELETONS */
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <Skeleton className="h-48 w-full rounded-3xl lg:col-span-2" />
              <Skeleton className="h-48 w-full rounded-2xl lg:col-span-3" />
            </div>
            <Skeleton className="h-[600px] w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* ==========================================
                TOP SECTION: SALDO & STATISTIK
                ========================================== */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Saldo Card */}
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-6 shadow-sm lg:col-span-2">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-poppins text-sm text-neutral-700">
                    Saldo Koin
                  </span>
                  <div className="flex items-center gap-2">
                    <Coins className="h-8 w-8 text-neutral-700" />
                    <span className="font-poppins text-3xl font-semibold text-neutral-700 md:text-4xl">
                      {stats.coinBalance.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="font-poppins text-sm text-neutral-500">
                    ≈ {formatRupiah(stats.coinBalance * stats.coinRate)}
                  </span>
                </div>
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-indigo-50 px-4 py-3">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="font-poppins text-sm text-blue-500">
                    Nilai 1 Koin = {formatRupiah(stats.coinRate)}
                  </span>
                </div>
              </div>

              {/* Statistik Card */}
              <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-6 shadow-sm lg:col-span-3">
                <h3 className="text-center font-poppins text-lg font-medium text-slate-900 md:text-left">
                  Statistik
                </h3>
                <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-50 bg-white p-6 shadow-sm">
                    <span className="font-poppins text-3xl font-semibold text-green-500">
                      {stats.successfulTopUps}
                    </span>
                    <span className="font-poppins text-sm text-neutral-700">
                      Top Up Berhasil
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-50 bg-white p-6 shadow-sm">
                    <span className="font-poppins text-3xl font-semibold text-amber-400">
                      {stats.pendingApprovals}
                    </span>
                    <span className="font-poppins text-sm text-neutral-700">
                      Menunggu Approval
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================
                MAIN SECTION: TOP UP FORM
                ========================================== */}
            <div className="flex flex-col gap-6 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm md:p-8">
              <h2 className="font-poppins text-lg font-medium text-slate-900">
                Top Up Koin
              </h2>

              <form
                onSubmit={handleSubmitTopUp}
                className="flex flex-col gap-6"
              >
                {/* 1. Pilih Jumlah Koin */}
                <SectionWrapper>
                  <div className="flex flex-col gap-4">
                    <span className="font-poppins text-base text-slate-900">
                      Pilih Jumlah Koin
                    </span>

                    {/* Grid Options */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {TOP_UP_OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => handleOptionSelect(opt.coins)}
                          className={cn(
                            "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border p-4 shadow-sm transition-all",
                            selectedOption === opt.coins
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-gray-100 bg-white hover:border-blue-300"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-zinc-600" />
                            <span className="font-poppins text-lg font-semibold text-zinc-600">
                              {opt.coins}
                            </span>
                          </div>
                          <span className="font-poppins text-xs text-neutral-700">
                            {formatRupiah(opt.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah koin sendiri"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="h-12 bg-white text-center font-poppins text-sm shadow-sm md:text-left"
                    />

                    {/* Kupon Input */}
                    <div className="mt-2 flex flex-col gap-2">
                      <Label className="font-poppins text-sm font-normal text-neutral-700">
                        Kode Kupon (Opsional)
                      </Label>
                      <Input
                        placeholder="Masukkan kode kupon jika ada"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="h-12 bg-white font-poppins text-sm"
                      />
                      <span className="font-poppins text-xs text-neutral-500">
                        Dapatkan bonus koin dengan kode kupon spesial
                      </span>
                    </div>
                  </div>
                </SectionWrapper>

                {/* 2. Instruksi Transfer */}
                <SectionWrapper title="Instruksi Transfer">
                  <div className="flex flex-col gap-6">
                    {/* Bank Card */}
                    <div className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-50 bg-white p-6 shadow-sm sm:grid-cols-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-sm text-neutral-500">
                          Nama Bank
                        </span>
                        <span className="font-poppins text-sm font-semibold text-neutral-700">
                          {bankInfo.bankName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-sm text-neutral-500">
                          Nomor Rekening
                        </span>
                        <span className="font-poppins text-sm font-semibold text-neutral-700">
                          {bankInfo.accountNumber}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-sm text-neutral-500">
                          Atas Nama
                        </span>
                        <span className="font-poppins text-sm font-semibold text-neutral-700">
                          {bankInfo.accountName}
                        </span>
                      </div>
                    </div>

                    {/* Ketentuan List */}
                    <div className="flex flex-col gap-2">
                      <span className="font-poppins text-sm font-semibold text-neutral-700">
                        Ketentuan:
                      </span>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <ul className="list-disc space-y-1 pl-5 font-poppins text-sm text-neutral-700">
                          <li>
                            Transfer sesuai jumlah yang dipilih ke rekening di
                            atas
                          </li>
                          <li>
                            Simpan bukti transfer dari bank atau e-wallet kamu
                          </li>
                          <li>Upload bukti transfer di form bawah ini</li>
                        </ul>
                        <ul className="list-disc space-y-1 pl-5 font-poppins text-sm text-neutral-700">
                          <li>Tunggu approval dari admin (maks 1x24 jam)</li>
                          <li>Koin akan otomatis masuk setelah disetujui</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SectionWrapper>

                {/* 3. Upload & Submit */}
                <SectionWrapper title="Upload Bukti Transfer">
                  <div className="flex flex-col gap-6">
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      accept=".jpg,.png,.jpeg,.pdf"
                      onChange={handleFileChange}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-gray-300 bg-neutral-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50 md:p-12"
                    >
                      {paymentProof ? (
                        <>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <p className="max-w-[200px] truncate font-poppins text-sm font-semibold text-neutral-800 sm:max-w-xs">
                              {paymentProof.name}
                            </p>
                            <p className="mt-1 font-poppins text-xs text-neutral-500">
                              Klik untuk mengganti file
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 transition-colors group-hover:bg-blue-100">
                            <UploadCloud className="h-6 w-6 text-neutral-500 group-hover:text-blue-500" />
                          </div>
                          <span className="font-montserrat text-sm text-neutral-700">
                            Klik untuk unggah bukti transfer
                          </span>
                          <span className="font-poppins text-xs text-neutral-400">
                            Format: JPG, PNG (Max 5MB)
                          </span>
                        </>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        (!selectedOption && !customAmount) ||
                        !paymentProof
                      }
                      className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Memproses...
                        </>
                      ) : (
                        "Ajukan Top Up"
                      )}
                    </Button>
                  </div>
                </SectionWrapper>
              </form>
            </div>

            {/* ==========================================
                HISTORY SECTION
                ========================================== */}
            <div className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-4 shadow-sm md:p-6">
              <h2 className="font-poppins text-lg font-medium text-slate-900">
                History Transaksi
              </h2>

              <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader className="bg-blue-50/50">
                      <TableRow className="border-sky-100 hover:bg-transparent">
                        <TableHead className="w-16 py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                          No
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                          Jenis Transaksi
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                          Tanggal
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                          Jam
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                          Jumlah Koin
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-8 text-center font-poppins text-sm text-neutral-500"
                          >
                            Belum ada riwayat transaksi.
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((tx, index) => {
                          const isPositive = tx.coinAmount > 0
                          return (
                            <TableRow
                              key={tx.id}
                              className="border-sky-100 bg-transparent hover:bg-white/50"
                            >
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {index + 1}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {tx.type}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {tx.date}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {tx.time}
                              </TableCell>
                              <TableCell
                                className={`py-4 text-center font-poppins text-sm font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}
                              >
                                {isPositive
                                  ? `+ ${tx.coinAmount}`
                                  : `- ${Math.abs(tx.coinAmount)}`}
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex justify-center">
                                  <TransactionBadge status={tx.status} />
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
