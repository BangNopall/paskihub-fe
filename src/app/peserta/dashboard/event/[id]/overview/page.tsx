"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Banknote,
  Eye,
  Users,
  Award,
  UploadCloud,
  FileText,
  Loader2,
  AlertCircle,
  ImageIcon,
  X,
} from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export interface EventDetail {
  id: string
  title: string
  description: string
  date: string
  location: string
  price: number
  targetDate: string // Format ISO ISO8601 untuk countdown
}

export interface TeamSummary {
  teamId: string
  teamName: string
  registeredAs: string
  logoUrl: string
  officialCount: number
  pasukanCount: number
}

export type PaymentStatusType = "Lunas" | "Belum Lunas/DP"

export interface PaymentInfo {
  status: PaymentStatusType
  amountPaid: number
  totalAmount: number
  remainingAmount: number
  proofUrl: string
}

export interface ScoreDetail {
  id: string
  category: string
  juri1: number
  juri2: number
  juri3: number
  total: number
}

export interface LeaderboardEntry {
  id: string
  rank: number
  teamName: string
  schoolName: string
  score: number
  isCurrentTeam: boolean
}

export interface CategoryLeaderboard {
  categoryId: string
  categoryName: string
  top3: LeaderboardEntry[] // Length <= 3
  rankings: LeaderboardEntry[]
}

export interface DashboardData {
  event: EventDetail
  team: TeamSummary
  payment: PaymentInfo
  recap: {
    totalScore: number
    maxScore: number
    percentage: number
    details: ScoreDetail[]
  }
  leaderboards: CategoryLeaderboard[]
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_DATA: DashboardData = {
  event: {
    id: "evt-robo-2026",
    title: "Kompetisi Robotika Nasional 2026",
    description:
      "Kompetisi robotika tingkat nasional untuk pelajar SD-SMA. Event ini menguji kemampuan peserta dalam merancang, membangun, dan memprogram robot untuk menyelesaikan berbagai tantangan.",
    date: "15 Maret 2026",
    location: "Lapangan Monas, Jakarta Pusat",
    price: 500000,
    targetDate: "2026-03-15T08:00:00Z", // Asumsi waktu mulai
  },
  team: {
    teamId: "tm-alpha",
    teamName: "Paskibra Elang Jaya",
    registeredAs: "Tim yang didaftarkan",
    logoUrl: "", // Kosong untuk memicu fallback
    officialCount: 2,
    pasukanCount: 16,
  },
  payment: {
    status: "Belum Lunas/DP",
    amountPaid: 250000,
    totalAmount: 500000,
    remainingAmount: 250000,
    proofUrl: "#",
  },
  recap: {
    totalScore: 433,
    maxScore: 500,
    percentage: 86.6,
    details: [
      {
        id: "c1",
        category: "PBB (Peraturan Baris Berbaris)",
        juri1: 85,
        juri2: 88,
        juri3: 90,
        total: 263,
      },
      {
        id: "c2",
        category: "Danton (Komandan Pasukan)",
        juri1: 90,
        juri2: 87,
        juri3: 92,
        total: 269,
      },
      {
        id: "c3",
        category: "Variasi (Formasi Kreatif)",
        juri1: 88,
        juri2: 91,
        juri3: 89,
        total: 268,
      },
    ],
  },
  leaderboards: [
    {
      categoryId: "cat-pbb",
      categoryName: "PBB (Peraturan Baris Berbaris)",
      top3: [
        {
          id: "t2",
          rank: 1,
          teamName: "Paskibra Elang Jaya",
          schoolName: "SMAN 8 Jakarta",
          score: 269,
          isCurrentTeam: true,
        },
        {
          id: "t1",
          rank: 2,
          teamName: "Paskibra Garuda Sakti",
          schoolName: "SMAN 1 Jakarta",
          score: 265,
          isCurrentTeam: false,
        },
        {
          id: "t3",
          rank: 3,
          teamName: "Paskibra Merah Putih",
          schoolName: "SMAN 3 Bandung",
          score: 258,
          isCurrentTeam: false,
        },
      ],
      rankings: [
        {
          id: "t1",
          rank: 1,
          teamName: "Paskibra Garuda Sakti",
          schoolName: "SMAN 1 Jakarta",
          score: 285,
          isCurrentTeam: false,
        },
        {
          id: "t2",
          rank: 2,
          teamName: "Paskibra Elang Jaya",
          schoolName: "SMAN 8 Jakarta",
          score: 263,
          isCurrentTeam: true,
        },
        {
          id: "t3",
          rank: 3,
          teamName: "Paskibra Merah Putih",
          schoolName: "SMAN 3 Bandung",
          score: 255,
          isCurrentTeam: false,
        },
        {
          id: "t4",
          rank: 4,
          teamName: "Paskibra Nusantara",
          schoolName: "SMAN 2 Surabaya",
          score: 245,
          isCurrentTeam: false,
        },
        {
          id: "t5",
          rank: 5,
          teamName: "Paskibra Bintang",
          schoolName: "SMAN 5 Medan",
          score: 240,
          isCurrentTeam: false,
        },
      ],
    },
    // Mock data untuk kategori lain (Danton, Variasi) bisa ditambahkan di sini dengan struktur yang sama
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

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-sky-100 bg-white/70 shadow-sm backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}

function PaymentBadge({ status }: { status: PaymentStatusType }) {
  const isLunas = status === "Lunas"
  return (
    <div
      className={`flex w-max items-center justify-center rounded-xl border px-3 py-1 ${isLunas ? "border-green-400 bg-emerald-50 text-green-500" : "border-red-300 bg-rose-50 text-red-500"}`}
    >
      <span className="font-poppins text-xs font-medium">{status}</span>
    </div>
  )
}

// Komponen Podium
function PodiumItem({ entry }: { entry: LeaderboardEntry }) {
  // Styling dinamis berdasarkan ranking
  let bgClass = "bg-gray-50 border-gray-200"
  let badgeClass = "bg-stone-300 text-white"

  if (entry.rank === 1) {
    bgClass = "bg-yellow-50 border-amber-200 h-[260px]" // Lebih tinggi
    badgeClass = "bg-amber-300 text-white"
  } else if (entry.rank === 2) {
    bgClass = "bg-gray-50 border-gray-200 h-[220px]"
    badgeClass = "bg-stone-300 text-white"
  } else if (entry.rank === 3) {
    bgClass = "bg-rose-50 border-orange-200 h-[220px]"
    badgeClass = "bg-red-400 text-white"
  }

  return (
    <div
      className={`relative flex w-full flex-col items-center rounded-2xl border-2 p-4 pt-6 md:w-40 ${bgClass}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${badgeClass}`}
      >
        <span className="font-montserrat text-xl font-bold">{entry.rank}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col items-center justify-between gap-2 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="line-clamp-2 font-poppins text-sm font-semibold text-neutral-800">
            {entry.teamName}
          </span>
          <span className="line-clamp-1 font-poppins text-xs text-neutral-500">
            {entry.schoolName}
          </span>
        </div>
        <span className="font-poppins text-2xl font-bold text-neutral-800">
          {entry.score}
        </span>
      </div>
    </div>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function EventDashboardPage() {
  const params = useParams()
  const eventId = params?.id

  // --- STATE MANAGEMENT ---
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Modal DP State
  const [isDPModalOpen, setIsDPModalOpen] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmittingDP, setIsSubmittingDP] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- FETCH DATA SIMULATION ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/peserta/events/{eventId}/dashboard
        await new Promise((res) => setTimeout(res, 1200)) // Simulate delay
        setData(MOCK_DATA)
      } catch (err) {
        console.error(err)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [eventId])

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    if (!data?.event?.targetDate) return

    const calculateTimeLeft = () => {
      const difference = +new Date(data.event.targetDate) - +new Date()
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return timeLeft
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [data?.event?.targetDate])

  // --- HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0])
    }
  }

  const submitDPPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentProof) {
      alert("Harap upload bukti pembayaran!")
      return
    }

    setIsSubmittingDP(true)
    try {
      // TODO: Integrasi API POST upload sisa pembayaran
      console.log("Submitting DP with file:", paymentProof.name)
      await new Promise((res) => setTimeout(res, 2000))
      alert("Bukti pembayaran berhasil diunggah dan sedang diproses.")
      setIsDPModalOpen(false)
      setPaymentProof(null)
    } catch (err) {
      alert("Terjadi kesalahan sistem saat mengunggah.")
    } finally {
      setIsSubmittingDP(false)
    }
  }

  // --- ERROR UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-blue-500"
        >
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* BACK BUTTON */}
        <div className="flex items-center gap-2">
          <Link
            href="/peserta/dashboard/event"
            className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-montserrat text-base font-semibold md:text-lg">
              Kembali
            </span>
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-full" />
            <Skeleton className="h-100 w-full rounded-2xl" />
          </div>
        ) : (
          data && (
            <div className="flex flex-col gap-8">
              {/* HEADER EVENT CARD */}
              <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-sky-50/50 p-5 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-200 md:h-32 md:w-32">
                    {/* Placeholder Icon jika tidak ada logo */}
                    <ImageIcon className="h-10 w-10 text-neutral-400" />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h1 className="font-poppins text-xl font-semibold text-neutral-800 md:text-2xl">
                        {data.event.title}
                      </h1>
                      <p className="font-poppins text-sm text-neutral-500 md:text-base">
                        {data.event.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 md:text-sm">
                          Tanggal:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {data.event.date}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 md:text-sm">
                          Lokasi:
                        </span>
                        <span className="line-clamp-2 font-poppins text-sm font-medium text-neutral-800">
                          {data.event.location}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 md:text-sm">
                          Biaya Event:
                        </span>
                        <span className="font-poppins text-sm font-bold text-blue-500 md:text-base">
                          {formatRupiah(data.event.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COUNTDOWN BOX */}
                <div className="flex flex-col gap-3 rounded-xl border border-orange-200 bg-rose-50/50 p-4 md:p-6">
                  <span className="font-inter text-base font-semibold text-amber-800 md:text-lg">
                    Hitung Mundur ke Hari-H
                  </span>
                  <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {[
                      { label: "Hari", value: timeLeft.days },
                      { label: "Jam", value: timeLeft.hours },
                      { label: "Menit", value: timeLeft.minutes },
                      { label: "Detik", value: timeLeft.seconds },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center rounded-lg border border-orange-200 bg-white py-2 shadow-sm md:py-4"
                      >
                        <span className="font-inter text-xl font-bold text-red-400 md:text-3xl">
                          {String(item.value).padStart(2, "0")}
                        </span>
                        <span className="font-inter text-[10px] text-neutral-500 md:text-xs">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SHADCN TABS */}
              <Tabs
                defaultValue="overview"
                className="flex w-full flex-col gap-6"
              >
                <div className="flex w-full justify-start overflow-x-auto pb-2 sm:justify-center sm:pb-0">
                  <TabsList className="flex h-auto w-max min-w-full items-center gap-2 rounded-full border border-sky-100 bg-white p-2 shadow-sm md:min-w-[700px]">
                    <TabsTrigger
                      value="overview"
                      className="flex-1 rounded-full px-6 py-2.5 font-poppins text-sm font-medium text-neutral-400 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-neutral-800"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="rekap"
                      className="flex-1 rounded-full px-6 py-2.5 font-poppins text-sm font-medium text-neutral-400 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-neutral-800"
                    >
                      Rekap Nilai
                    </TabsTrigger>
                    <TabsTrigger
                      value="leaderboard"
                      className="flex-1 rounded-full px-6 py-2.5 font-poppins text-sm font-medium text-neutral-400 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-neutral-800"
                    >
                      Leaderboard
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ====================================
                  TAB: OVERVIEW
                  ==================================== */}
                <TabsContent
                  value="overview"
                  className="m-0 flex flex-col gap-6 outline-none"
                >
                  <GlassCard className="flex flex-col gap-6 p-5 md:p-8">
                    {/* Data Tim */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-poppins text-lg font-semibold text-neutral-800">
                        Data Tim Terdaftar
                      </h3>
                      <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4">
                        <div className="h-14 w-14 rounded-lg bg-stone-200"></div>
                        <div className="flex flex-col">
                          <span className="font-poppins text-base font-semibold text-neutral-800">
                            {data.team.teamName}
                          </span>
                          <span className="font-poppins text-xs text-neutral-500">
                            {data.team.registeredAs}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informasi Pembayaran */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-poppins text-lg font-semibold text-neutral-800">
                        Informasi Pembayaran
                      </h3>
                      <div className="grid grid-cols-1 gap-6 rounded-xl border border-sky-100 bg-white/40 p-5 md:grid-cols-3 md:gap-8">
                        <div className="flex flex-col gap-2">
                          <span className="font-poppins text-sm text-neutral-500">
                            Status Pembayaran
                          </span>
                          <PaymentBadge status={data.payment.status} />
                        </div>

                        {data.payment.status === "Belum Lunas/DP" ? (
                          <div className="flex flex-col gap-2">
                            <span className="font-poppins text-sm text-neutral-500">
                              Sisa Pembayaran
                            </span>
                            <div className="flex flex-col items-start gap-2">
                              <span className="font-poppins text-xl font-semibold text-blue-500">
                                {formatRupiah(data.payment.remainingAmount)}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => setIsDPModalOpen(true)}
                                className="rounded-full bg-red-400 text-white hover:bg-red-500"
                              >
                                Bayar Sisa
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <span className="font-poppins text-sm text-neutral-500">
                              Jumlah Dibayar
                            </span>
                            <span className="font-poppins text-xl font-semibold text-blue-500">
                              {formatRupiah(data.payment.amountPaid)}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <span className="font-poppins text-sm text-neutral-500">
                            Bukti Pembayaran
                          </span>
                          <Button
                            variant="outline"
                            className="font-inter w-fit gap-2 border-neutral-300 text-neutral-700"
                          >
                            <Eye className="h-4 w-4" /> Lihat Bukti
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Ringkasan Tim */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-poppins text-lg font-semibold text-neutral-800">
                        Ringkasan Tim
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400 text-white shadow-sm">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-poppins text-xs text-neutral-500">
                              Jumlah Official
                            </span>
                            <span className="font-poppins text-base font-semibold text-neutral-800">
                              {data.team.officialCount} Orang
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400 text-white shadow-sm">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-poppins text-xs text-neutral-500">
                              Jumlah Pasukan
                            </span>
                            <span className="font-poppins text-base font-semibold text-neutral-800">
                              {data.team.pasukanCount} Orang
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ====================================
                  TAB: REKAP NILAI
                  ==================================== */}
                <TabsContent
                  value="rekap"
                  className="m-0 flex flex-col gap-6 outline-none"
                >
                  {/* Total Score Card */}
                  <GlassCard className="flex flex-col gap-6 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-poppins text-lg font-semibold text-neutral-800">
                          Total Nilai
                        </h3>
                        <p className="font-poppins text-sm text-neutral-500">
                          Akumulasi nilai dari semua kategori
                        </p>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <span className="font-poppins text-3xl font-bold text-blue-500">
                          {data.recap.totalScore}
                        </span>
                        <span className="font-poppins text-sm text-neutral-500">
                          dari {data.recap.maxScore} poin
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Progress
                        value={data.recap.percentage}
                        className="indicator-blue-500 h-3 bg-gray-200"
                      />
                      <span className="font-inter text-center text-sm text-neutral-500 md:text-left">
                        {data.recap.percentage}% dari nilai maksimal
                      </span>
                    </div>
                  </GlassCard>

                  {/* Score Details Table */}
                  <GlassCard className="overflow-hidden p-0">
                    <div className="p-6 pb-4">
                      <h3 className="font-poppins text-lg font-semibold text-neutral-800">
                        Rincian Nilai per Kategori
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-y border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50/50">
                            <TableHead className="py-4 pl-6 font-poppins text-sm font-semibold text-neutral-700">
                              Kategori
                            </TableHead>
                            <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                              Juri 1
                            </TableHead>
                            <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                              Juri 2
                            </TableHead>
                            <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                              Juri 3
                            </TableHead>
                            <TableHead className="py-4 pr-6 text-center font-poppins text-sm font-semibold text-neutral-700">
                              Total
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.recap.details.map((detail) => (
                            <TableRow
                              key={detail.id}
                              className="border-b border-neutral-200 hover:bg-neutral-50/50"
                            >
                              <TableCell className="py-4 pl-6 font-poppins text-sm text-neutral-700">
                                {detail.category}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {detail.juri1}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {detail.juri2}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-700">
                                {detail.juri3}
                              </TableCell>
                              <TableCell className="py-4 pr-6 text-center font-poppins text-sm font-semibold text-blue-500">
                                {detail.total}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* ====================================
                  TAB: LEADERBOARD
                  ==================================== */}
                <TabsContent
                  value="leaderboard"
                  className="m-0 flex flex-col gap-6 outline-none"
                >
                  {data.leaderboards.map((board) => (
                    <GlassCard
                      key={board.categoryId}
                      className="flex flex-col gap-8 p-6 md:p-8"
                    >
                      <h3 className="border-b border-neutral-200/50 pb-4 font-poppins text-lg font-semibold text-neutral-800">
                        {board.categoryName}
                      </h3>

                      {/* PODIUM (Top 3) */}
                      <div className="flex flex-col items-end justify-center gap-4 pt-4 md:flex-row md:gap-8">
                        {/* Render urutan: Juara 2, Juara 1, Juara 3 secara visual */}
                        {board.top3.length > 1 && (
                          <PodiumItem entry={board.top3[1]} />
                        )}
                        {board.top3.length > 0 && (
                          <PodiumItem entry={board.top3[0]} />
                        )}
                        {board.top3.length > 2 && (
                          <PodiumItem entry={board.top3[2]} />
                        )}
                      </div>

                      {/* RANKING TABLE */}
                      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                                <TableHead className="w-24 py-4 pl-6 font-poppins text-sm font-semibold text-neutral-700">
                                  Ranking
                                </TableHead>
                                <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">
                                  Nama Tim
                                </TableHead>
                                <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">
                                  Nama Sekolah
                                </TableHead>
                                <TableHead className="py-4 pr-6 text-center font-poppins text-sm font-semibold text-neutral-700">
                                  Total Nilai
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {board.rankings.map((rank) => (
                                <TableRow
                                  key={rank.id}
                                  className={`hover:bg-neutral-50/50 ${rank.isCurrentTeam ? "border-l-4 border-l-blue-500 bg-indigo-50" : ""}`}
                                >
                                  <TableCell className="py-4 pl-6 font-poppins text-sm font-semibold text-neutral-800">
                                    {rank.rank}
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`font-poppins text-sm ${rank.isCurrentTeam ? "font-semibold text-blue-600" : "text-neutral-700"}`}
                                      >
                                        {rank.teamName}
                                      </span>
                                      {rank.isCurrentTeam && (
                                        <Badge className="bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-blue-600">
                                          Tim Anda
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4 font-poppins text-sm text-neutral-600">
                                    {rank.schoolName}
                                  </TableCell>
                                  <TableCell className="py-4 pr-6 text-center font-poppins text-sm font-bold text-neutral-800">
                                    {rank.score}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )
        )}

        {/* =========================================
            MODAL BAYAR SISA (DP)
            ========================================= */}
        <Dialog open={isDPModalOpen} onOpenChange={setIsDPModalOpen}>
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[40px]">
            {data && (
              <form onSubmit={submitDPPayment} className="flex flex-col">
                <DialogHeader className="border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-10">
                  <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                    Bayar Sisa Pembayaran
                  </DialogTitle>
                  <DialogDescription className="text-center font-poppins text-sm text-neutral-400">
                    Lengkapi form pembayaran untuk melunasi sisa pembayaran
                    event
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  {/* Event Info Snippet */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-300">
                        <ImageIcon className="h-6 w-6 text-neutral-500" />
                      </div>
                      <h3 className="font-poppins text-base font-semibold text-neutral-800">
                        {data.event.title}
                      </h3>
                    </div>
                    <p className="font-poppins text-xs text-neutral-500">
                      {data.event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-200/50 pt-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500">
                          Sisa Pembayaran:
                        </span>
                        <span className="font-poppins text-lg font-bold text-blue-500">
                          {formatRupiah(data.payment.remainingAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-700">
                      Upload Bukti Pembayaran{" "}
                      <span className="text-red-500">*</span>
                    </Label>

                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      accept=".jpg,.png,.pdf"
                      onChange={handleFileChange}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50 sm:p-8"
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
                          <div className="flex flex-col gap-1 text-center">
                            <p className="font-poppins text-sm font-medium text-neutral-700">
                              Drag & drop file di sini
                            </p>
                            <p className="font-poppins text-sm text-neutral-500">
                              atau
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="pointer-events-none h-9 px-6 font-poppins text-sm"
                          >
                            Pilih File
                          </Button>
                          <p className="mt-2 text-center font-poppins text-xs text-neutral-400">
                            Format: JPG, PNG, atau PDF. Maksimal 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-col-reverse items-center gap-3 sm:flex-row">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 w-full rounded-full border-neutral-300 font-poppins text-base font-semibold text-neutral-600 hover:bg-neutral-100 sm:flex-1"
                      >
                        Batal
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={isSubmittingDP || !paymentProof}
                      className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:flex-1"
                    >
                      {isSubmittingDP ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Memproses...
                        </>
                      ) : (
                        "Bayar Sisa"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
