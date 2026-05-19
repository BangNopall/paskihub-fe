"use client"

import React, { useEffect, useRef, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  Users,
  UploadCloud,
  FileText,
  Loader2,
  AlertCircle,
  ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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

import { pelunasanEventAction } from "@/actions/participant-event.actions"
import type {
  AssessmentRecap,
  ParticipantScoreboard,
  ParticipantScoreboardItem,
  RegistrationDetail,
} from "@/schemas/participant-event.schema"

export type PaymentStatusType = "Lunas" | "Belum Lunas/DP" | string

const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""
const EMPTY_TIME_LEFT = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function formatRupiah(amount: number | string) {
  const numAmount = typeof amount === "string" ? parseInt(amount, 10) : amount
  if (isNaN(numAmount)) return amount
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numAmount)
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

function getAssetUrl(path?: string | null) {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${ASSET_BASE_URL}${normalizedPath}`
}

function calculateTimeLeft(targetDate?: string | null) {
  if (!targetDate) return EMPTY_TIME_LEFT

  const difference = +new Date(targetDate) - +new Date()

  if (difference <= 0) return EMPTY_TIME_LEFT

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function PaymentBadge({ status }: { status: PaymentStatusType }) {
  const isLunas = status === "FULL_PAID"
  const label = isLunas
    ? "Lunas"
    : status === "DP_PAID"
      ? "Belum Lunas/DP"
      : status
  return (
    <div
      className={`flex w-max items-center justify-center rounded-xl border px-3 py-1 ${isLunas ? "border-green-400 bg-emerald-50 text-green-500" : "border-red-300 bg-rose-50 text-red-500"}`}
    >
      <span className="font-poppins text-xs font-medium">{label}</span>
    </div>
  )
}

function PodiumItem({ entry }: { entry: ParticipantScoreboardItem }) {
  let bgClass = "bg-gray-50 border-gray-200"
  let badgeClass = "bg-stone-300 text-white"

  if (entry.rank === 1) {
    bgClass = "bg-yellow-50 border-amber-200 h-[260px]"
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
            {entry.team_name}
          </span>
          <span className="line-clamp-2 font-poppins text-[10px] font-medium text-neutral-500 md:text-xs">
            {entry.insti_name}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-poppins text-sm font-bold text-neutral-800 md:text-lg">
            {entry.final_score}
          </span>
        </div>
      </div>
    </div>
  )
}

interface EventOverviewClientProps {
  registrationId: string
  registrationDetail: RegistrationDetail | null
  recap: AssessmentRecap | null
  scoreboard: ParticipantScoreboard | null
}

export default function EventOverviewClient({
  registrationId,
  registrationDetail,
  recap,
  scoreboard,
}: EventOverviewClientProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(registrationDetail?.event.target_date)
  )

  const [isDPModalOpen, setIsDPModalOpen] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmittingDP, setIsSubmittingDP] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const data = registrationDetail

  // Calculate percentage
  const maxScore = recap?.max_score ?? 500
  let percentage = 0
  if (recap?.final_score) {
    percentage = (recap.final_score / maxScore) * 100
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(data?.event.target_date))
    }, 1000)

    return () => clearInterval(timer)
  }, [data?.event?.target_date])

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
    const formData = new FormData()
    formData.append("payment_proof", paymentProof)

    const res = await pelunasanEventAction(registrationId, formData)
    setIsSubmittingDP(false)

    if (res.success) {
      alert(res.message)
      setIsDPModalOpen(false)
      setPaymentProof(null)
      startTransition(() => {
        router.refresh()
      })
    } else {
      alert(res.message)
    }
  }

  if (!data) {
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

  const eventLogoUrl = getAssetUrl(data.event.logo_url ?? data.event.logo_path)
  const teamLogoUrl = getAssetUrl(data.team.logo_url)
  const paymentProofUrl = getAssetUrl(data.payment.proof_url)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
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

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-sky-50/50 p-5 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-200 md:h-32 md:w-32">
                {eventLogoUrl ? (
                  <Image
                    src={eventLogoUrl}
                    className="h-full w-full object-cover"
                    alt="Logo"
                    fill
                    sizes="(min-width: 768px) 128px, 96px"
                    unoptimized
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-neutral-400" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-poppins text-xl font-semibold text-neutral-800 md:text-2xl">
                    {data.event.title}
                  </h1>
                  <p className="font-poppins text-sm text-neutral-500 md:text-base">
                    {data.event.description || "-"}
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

          <Tabs defaultValue="overview" className="flex w-full flex-col gap-6">
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

            <TabsContent
              value="overview"
              className="m-0 flex flex-col gap-6 outline-none"
            >
              <GlassCard className="flex flex-col gap-6 p-5 md:p-8">
                <div className="flex flex-col gap-4">
                  <h3 className="font-poppins text-lg font-semibold text-neutral-800">
                    Data Tim Terdaftar
                  </h3>
                  <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4">
                    <div className="relative h-14 w-14 rounded-lg bg-stone-200">
                      {teamLogoUrl && (
                        <Image
                          src={teamLogoUrl}
                          className="h-full w-full rounded-lg object-cover"
                          alt="Team Logo"
                          fill
                          sizes="56px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-poppins text-base font-semibold text-neutral-800">
                        {data.team.name}
                      </span>
                    </div>
                  </div>
                </div>

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

                    {data.payment.status === "DP_PAID" ? (
                      <div className="flex flex-col gap-2">
                        <span className="font-poppins text-sm text-neutral-500">
                          Sisa Pembayaran
                        </span>
                        <div className="flex flex-col items-start gap-2">
                          <span className="font-poppins text-xl font-semibold text-blue-500">
                            {formatRupiah(data.payment.remaining_amount || 0)}
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
                          {formatRupiah(data.payment.amount_paid || 0)}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <span className="font-poppins text-sm text-neutral-500">
                        Bukti Pembayaran
                      </span>
                      {paymentProofUrl && (
                        <a
                          href={paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="font-inter w-fit gap-2 border-neutral-300 text-neutral-700"
                          >
                            <Eye className="h-4 w-4" /> Lihat Bukti
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

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
                          {data.team.official_count} Orang
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
                          {data.team.pasukan_count} Orang
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent
              value="rekap"
              className="m-0 flex flex-col gap-6 outline-none"
            >
              {!recap ? (
                <div className="p-8 text-center text-neutral-500">
                  Rekap nilai belum tersedia.
                </div>
              ) : (
                <>
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
                          {recap.final_score}
                        </span>
                        <span className="font-poppins text-sm text-neutral-500">
                          dari {maxScore} poin
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Progress
                        value={percentage}
                        className="indicator-blue-500 h-3 bg-gray-200"
                      />
                      <span className="font-inter text-center text-sm text-neutral-500 md:text-left">
                        {percentage.toFixed(1)}% dari nilai maksimal
                      </span>
                    </div>
                  </GlassCard>

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
                            <TableHead className="py-4 pl-6 font-poppins text-sm font-semibold text-neutral-700">
                              Sub Kategori
                            </TableHead>
                            <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                              Juri / Nilai
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recap.categories.map((cat, i) => (
                            <React.Fragment key={i}>
                              <TableRow className="border-b border-neutral-200 bg-neutral-100">
                                <TableCell
                                  colSpan={3}
                                  className="py-2 pl-6 font-poppins text-sm font-semibold text-neutral-800"
                                >
                                  {cat.category_name}
                                </TableCell>
                              </TableRow>
                              {cat.sub_categories.map((sub, j) => (
                                <TableRow
                                  key={j}
                                  className="border-b border-neutral-200 hover:bg-neutral-50/50"
                                >
                                  <TableCell></TableCell>
                                  <TableCell className="py-4 pl-6 font-poppins text-sm text-neutral-700">
                                    {sub.name}
                                  </TableCell>
                                  <TableCell className="flex justify-center gap-4 py-4 text-center font-poppins text-sm text-neutral-700">
                                    {sub.scores.map((score, k) => (
                                      <div
                                        key={k}
                                        className="flex flex-col text-xs"
                                      >
                                        <span className="font-semibold">
                                          {score.judge_name}
                                        </span>
                                        <span>{score.value}</span>
                                      </div>
                                    ))}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </GlassCard>
                </>
              )}
            </TabsContent>

            <TabsContent
              value="leaderboard"
              className="m-0 flex flex-col gap-6 outline-none"
            >
              {!scoreboard ? (
                <div className="p-8 text-center text-neutral-500">
                  Leaderboard belum dipublish oleh organizer.
                </div>
              ) : (
                <GlassCard className="flex flex-col gap-8 p-6 md:p-8">
                  <h3 className="border-b border-neutral-200/50 pb-4 font-poppins text-lg font-semibold text-neutral-800">
                    Leaderboard Utama
                  </h3>

                  <div className="flex flex-col items-end justify-center gap-4 pt-4 md:flex-row md:gap-8">
                    {scoreboard.items?.length > 1 && (
                      <PodiumItem entry={scoreboard.items[1]} />
                    )}
                    {scoreboard.items?.length > 0 && (
                      <PodiumItem entry={scoreboard.items[0]} />
                    )}
                    {scoreboard.items?.length > 2 && (
                      <PodiumItem entry={scoreboard.items[2]} />
                    )}
                  </div>

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
                          {scoreboard.items.map((rank) => (
                            <TableRow
                              key={rank.regis_id}
                              className={`hover:bg-neutral-50/50 ${rank.regis_id === registrationId ? "border-l-4 border-l-blue-500 bg-indigo-50" : ""}`}
                            >
                              <TableCell className="py-4 pl-6 font-poppins text-sm font-semibold text-neutral-800">
                                {rank.rank}
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`font-poppins text-sm ${rank.regis_id === registrationId ? "font-semibold text-blue-600" : "text-neutral-700"}`}
                                  >
                                    {rank.team_name}
                                  </span>
                                  {rank.regis_id === registrationId && (
                                    <Badge className="bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-blue-600">
                                      Tim Anda
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4 font-poppins text-sm text-neutral-600">
                                {rank.insti_name}
                              </TableCell>
                              <TableCell className="py-4 pr-6 text-center font-poppins text-sm font-bold text-neutral-800">
                                {rank.final_score}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </GlassCard>
              )}
            </TabsContent>
          </Tabs>
        </div>

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
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-300">
                        {eventLogoUrl ? (
                          <Image
                            src={eventLogoUrl}
                            className="h-full w-full rounded-xl object-cover"
                            alt="Logo"
                            fill
                            sizes="48px"
                            unoptimized
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-neutral-500" />
                        )}
                      </div>
                      <h3 className="font-poppins text-base font-semibold text-neutral-800">
                        {data.event.title}
                      </h3>
                    </div>
                    <p className="font-poppins text-xs text-neutral-500">
                      {data.event.description || "-"}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-200/50 pt-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500">
                          Sisa Pembayaran:
                        </span>
                        <span className="font-poppins text-lg font-bold text-blue-500">
                          {formatRupiah(data.payment.remaining_amount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

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
