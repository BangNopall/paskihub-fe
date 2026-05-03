"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Search,
  MapPin,
  Calendar,
  Banknote,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  UploadCloud,
  FileText,
  X,
} from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export type EventStatus = "Open" | "Closed"
export type PaymentStatus =
  | "Verifikasi Pembayaran"
  | "Belum Lunas/DP"
  | "Terdaftar"
  | "Ditolak"

export interface ExploreEvent {
  id: string
  logoUrl: string
  title: string
  organizer: string
  status: EventStatus
  description: string
  date: string
  location: string
  price: number
  quota: number
  memberCount: string
}

export interface ActiveEvent {
  id: string
  logoUrl: string
  eventName: string
  teamName: string
  paymentStatus: PaymentStatus
  paymentType?: "lunas" | "dp"
  rejectionReason?: string
}

export interface MyTeam {
  id: string
  name: string
}

export interface RegistrationPayload {
  eventId: string
  teamId: string
  paymentType: "lunas" | "dp"
  paymentProof: File | null
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const mockExploreEvents: ExploreEvent[] = [
  {
    id: "evt-1",
    logoUrl: "", // Kosong untuk simulasi fallback icon
    title: "Lomba Gerak Jalan Nasional",
    organizer: "SMAN 1 Jakarta",
    status: "Open",
    description:
      "Kompetisi Paskibra tingkat nasional untuk SMA/SMK sederajat dengan kategori PBB dan Variasi.",
    date: "15 Maret 2026",
    location: "Lapangan Monas, Jakarta Pusat",
    price: 750000,
    quota: 50,
    memberCount: "15-25 orang",
  },
  {
    id: "evt-2",
    logoUrl: "",
    title: "Lomba Paskibra Jawa Barat",
    organizer: "Pemerintah Provinsi Jabar",
    status: "Open",
    description:
      "Kompetisi adu ketangkasan Paskibraka untuk tingkat SMA se-Provinsi Jawa Barat.",
    date: "20 Mei 2026",
    location: "Gedung Sate, Bandung",
    price: 500000,
    quota: 30,
    memberCount: "10-20 orang",
  },
  {
    id: "evt-3",
    logoUrl: "",
    title: "Gebyar Paskibra Merah Putih",
    organizer: "SMAN 3 Surabaya",
    status: "Closed",
    description:
      "Event bergengsi memperebutkan piala bergilir Walikota Surabaya.",
    date: "10 Agustus 2026",
    location: "Balai Kota Surabaya",
    price: 600000,
    quota: 40,
    memberCount: "15-20 orang",
  },
]

const mockActiveEvents: ActiveEvent[] = [
  {
    id: "act-1",
    logoUrl: "",
    eventName: "Garuda Nusantara",
    teamName: "Paskibra Elang Jaya",
    paymentStatus: "Verifikasi Pembayaran",
  },
  {
    id: "act-2",
    logoUrl: "",
    eventName: "Garuda Nusantara",
    teamName: "Paskibra Garuda Muda",
    paymentStatus: "Belum Lunas/DP",
  },
  {
    id: "act-3",
    logoUrl: "",
    eventName: "Paskibraka Cemerlang",
    teamName: "Paskibra Merah Putih",
    paymentStatus: "Terdaftar",
  },
  {
    id: "act-4",
    logoUrl: "",
    eventName: "Lomba Gerak Jalan Nasional",
    teamName: "Paskibra Nusantara",
    paymentStatus: "Ditolak",
    paymentType: "lunas",
    rejectionReason:
      "Bukti transfer tidak jelas, mohon upload ulang dengan resolusi lebih tinggi.",
  },
]

const mockMyTeams: MyTeam[] = [
  { id: "team-1", name: "Paskibra Elang Jaya" },
  { id: "team-2", name: "Paskibra Garuda Muda" },
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

function StatusBadge({ status }: { status: EventStatus }) {
  const isOpen = status === "Open"
  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-2 rounded-full border px-4 py-1 ${
        isOpen
          ? "border-green-300 bg-green-100 text-green-700"
          : "border-red-300 bg-red-100 text-red-700"
      }`}
    >
      <span className="font-poppins text-xs font-semibold">{status}</span>
    </div>
  )
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles = {
    "Verifikasi Pembayaran": "bg-yellow-50 border-yellow-400 text-yellow-600",
    "Belum Lunas/DP": "bg-red-50 border-red-300 text-red-500",
    Terdaftar: "bg-green-50 border-green-400 text-green-600",
    Ditolak: "bg-red-50 border-red-500 text-red-600",
  }

  return (
    <div
      className={`flex w-full max-w-[180px] items-center justify-center rounded-xl border px-3 py-1.5 ${styles[status]}`}
    >
      <span className="truncate font-poppins text-xs font-medium">
        {status}
      </span>
    </div>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function MyEventPage() {
  // --- STATE LIST EVENT ---
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")

  const [exploreEvents, setExploreEvents] = useState<ExploreEvent[]>([])
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([])
  const [myTeams, setMyTeams] = useState<MyTeam[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // --- STATE UNTUK MODAL DAFTAR EVENT ---
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] =
    useState<boolean>(false)
  const [selectedEventToRegister, setSelectedEventToRegister] =
    useState<ExploreEvent | null>(null)

  // State Form Pendaftaran
  const [selectedTeamId, setSelectedTeamId] = useState<string>("")
  const [paymentType, setPaymentType] = useState<"lunas" | "dp">("lunas")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- STATE UNTUK MODAL UPLOAD ULANG ---
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState<boolean>(false)
  const [reuploadActiveEvent, setReuploadActiveEvent] =
    useState<ActiveEvent | null>(null)
  const [reuploadProof, setReuploadProof] = useState<File | null>(null)
  const [isReuploading, setIsReuploading] = useState<boolean>(false)
  const reuploadFileInputRef = useRef<HTMLInputElement>(null)

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/events, /api/my-events, dan /api/my-teams
        await new Promise((resolve) => setTimeout(resolve, 1200)) // Simulasi delay

        setExploreEvents(mockExploreEvents)
        setActiveEvents(mockActiveEvents)
        setMyTeams(mockMyTeams)
      } catch (error) {
        console.error("Gagal mengambil data:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // --- HANDLERS ---
  const handleOpenRegistrationModal = (event: ExploreEvent) => {
    setSelectedEventToRegister(event)
    setIsRegistrationModalOpen(true)

    // Reset Form
    setSelectedTeamId("")
    setPaymentType("lunas")
    setPaymentProof(null)
  }

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false)
    setTimeout(() => setSelectedEventToRegister(null), 300) // Clear setelah animasi modal tertutup
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleDashboardAction = (eventId: string) => {
    // TODO: Arahkan ke dashboard spesifik event
    console.log("Menuju dashboard event:", eventId)
  }

  const handleReuploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReuploadProof(e.target.files[0])
    }
  }

  const handleReupload = (activeEvent: ActiveEvent) => {
    const matchedEvent = exploreEvents.find(
      (e) => e.title === activeEvent.eventName
    )
    setSelectedEventToRegister(matchedEvent || null)
    setReuploadActiveEvent(activeEvent)
    setReuploadProof(null)
    setIsReuploadModalOpen(true)
  }

  const handleCloseReuploadModal = () => {
    setIsReuploadModalOpen(false)
    setTimeout(() => {
      setReuploadActiveEvent(null)
      setSelectedEventToRegister(null)
    }, 300)
  }

  const submitReupload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reuploadActiveEvent || !reuploadProof) {
      alert("Harap pilih file bukti pembayaran!")
      return
    }

    setIsReuploading(true)

    try {
      // TODO: Integrasi API POST /api/events/reupload-proof
      console.log("=== PAYLOAD REUPLOAD ===", {
        eventId: reuploadActiveEvent.id,
        proof: reuploadProof,
      })
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulasi Loading

      alert("Upload ulang bukti pembayaran berhasil!")
      handleCloseReuploadModal()
    } catch (error) {
      console.error("Gagal upload ulang:", error)
      alert("Terjadi kesalahan sistem saat upload ulang.")
    } finally {
      setIsReuploading(false)
    }
  }

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEventToRegister || !selectedTeamId || !paymentProof) {
      alert("Harap lengkapi semua field yang wajib!")
      return
    }

    setIsSubmitting(true)

    const payload: RegistrationPayload = {
      eventId: selectedEventToRegister.id,
      teamId: selectedTeamId,
      paymentType,
      paymentProof,
    }

    try {
      // TODO: Integrasi API POST /api/events/register
      console.log("=== PAYLOAD PENDAFTARAN ===", payload)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulasi Loading Submit API

      alert("Pendaftaran Berhasil!")
      handleCloseRegistrationModal()
    } catch (error) {
      console.error("Gagal mendaftar:", error)
      alert("Terjadi kesalahan sistem saat mendaftar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- ERROR STATE UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <p className="mt-2 font-poppins text-sm text-neutral-500">
          Terjadi kesalahan saat mengambil data event. Silakan coba lagi nanti.
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:gap-10 md:p-6 lg:p-8">
        {/* HEADER */}
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          My Event
        </h1>

        {/* SHADCN TABS */}
        <Tabs
          defaultValue="active"
          className="flex w-full flex-col gap-6 md:gap-8"
        >
          {/* TABS LIST (Pill styling) */}
          <div className="flex w-full justify-start overflow-x-auto pb-2 sm:justify-center sm:pb-0">
            <TabsList className="flex h-auto w-max min-w-full items-center gap-2 rounded-full border border-sky-100 bg-white p-2 shadow-sm sm:min-w-[500px]">
              <TabsTrigger
                value="active"
                className="flex-1 rounded-full px-6 py-3 font-poppins text-sm font-semibold text-neutral-400 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-neutral-700 md:text-base"
              >
                Lomba Aktif Saya
              </TabsTrigger>
              <TabsTrigger
                value="explore"
                className="flex-1 rounded-full px-6 py-3 font-poppins text-sm font-semibold text-neutral-400 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-neutral-700 md:text-base"
              >
                Jelajahi Event Terbaru
              </TabsTrigger>
            </TabsList>
          </div>

          {/* =========================================
              TAB 1: JELAJAHI EVENT TERBARU
              ========================================= */}
          <TabsContent
            value="explore"
            className="m-0 flex flex-col gap-6 outline-none"
          >
            {/* FILTER BAR */}
            <div className="flex w-full flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-sm md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Cari nama event..."
                  className="w-full border-sky-100 bg-white pl-10 font-poppins text-sm text-zinc-700 focus-visible:ring-sky-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:max-w-[240px]">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-full border-sky-100 bg-white font-poppins text-sm text-zinc-700 focus:ring-sky-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-zinc-500" />
                      <SelectValue placeholder="Semua Lokasi" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Lokasi</SelectItem>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* EVENT GRID */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-6 rounded-3xl border border-sky-100 bg-white/50 p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Skeleton className="h-12 w-12 rounded-xl" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-40 md:w-56" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-24 w-full rounded-2xl" />
                      <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                  ))
                : exploreEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col gap-6 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/40 p-5 shadow-sm backdrop-blur-sm md:p-6"
                    >
                      <div className="flex flex-col gap-4">
                        {/* CARD HEADER */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-200">
                              {event.logoUrl ? (
                                <img
                                  src={event.logoUrl}
                                  alt="Logo"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-neutral-400" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="line-clamp-1 font-poppins text-base font-semibold text-slate-900">
                                {event.title}
                              </h3>
                              <p className="font-poppins text-xs font-medium text-neutral-500">
                                {event.organizer}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={event.status} />
                        </div>

                        <p className="line-clamp-2 font-poppins text-sm text-neutral-500">
                          {event.description}
                        </p>

                        {/* DETAILS BOX */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white/60 p-4 md:p-5">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span className="font-poppins text-sm text-neutral-600">
                              {event.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span className="font-poppins text-sm text-neutral-600">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Banknote className="h-4 w-4 shrink-0 text-neutral-700" />
                            <span className="font-poppins text-sm font-semibold text-neutral-800">
                              {formatRupiah(event.price)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleOpenRegistrationModal(event)}
                        disabled={event.status === "Closed"}
                        className="h-12 w-full rounded-full bg-red-400 text-base font-bold text-white shadow-sm transition-colors hover:bg-red-500 disabled:opacity-50"
                      >
                        Daftar Sekarang
                      </Button>
                    </div>
                  ))}
            </div>
          </TabsContent>

          {/* =========================================
              TAB 2: LOMBA AKTIF SAYA
              ========================================= */}
          <TabsContent value="active" className="m-0 outline-none">
            <div className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-sm md:p-6">
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-12 w-full rounded-t-2xl" />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}
                  <div className="hidden overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm md:block">
                    <Table>
                      <TableHeader className="bg-blue-50/50">
                        <TableRow className="border-sky-100 hover:bg-transparent">
                          <TableHead className="w-20 py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            Logo
                          </TableHead>
                          <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            Nama Event
                          </TableHead>
                          <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            Tim
                          </TableHead>
                          <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            Status Pembayaran
                          </TableHead>
                          <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            Aksi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeEvents.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="py-8 text-center font-poppins text-neutral-500"
                            >
                              Belum ada lomba aktif.
                            </TableCell>
                          </TableRow>
                        ) : (
                          activeEvents.map((event) => (
                            <React.Fragment key={event.id}>
                              <TableRow
                                className={`border-sky-100 bg-transparent hover:bg-white/50 ${event.paymentStatus === "Ditolak" ? "border-b-0" : ""}`}
                              >
                                <TableCell className="p-4">
                                  <div className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-stone-200">
                                    {event.logoUrl ? (
                                      <img
                                        src={event.logoUrl}
                                        alt="Logo"
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <ImageIcon className="h-5 w-5 text-neutral-400" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center font-poppins text-sm font-medium text-neutral-800">
                                  {event.eventName}
                                </TableCell>
                                <TableCell className="text-center font-poppins text-sm text-neutral-600">
                                  {event.teamName}
                                </TableCell>
                                <TableCell className="p-4">
                                  <div className="flex justify-center">
                                    <PaymentBadge
                                      status={event.paymentStatus}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="p-4">
                                  <div className="flex justify-center">
                                    {(event.paymentStatus === "Terdaftar" ||
                                      event.paymentStatus ===
                                        "Belum Lunas/DP") && (
                                      <Button
                                        onClick={() =>
                                          handleDashboardAction(event.id)
                                        }
                                        className="h-9 rounded-lg bg-blue-500 px-4 text-xs font-semibold text-white hover:bg-blue-600"
                                      >
                                        Overview
                                      </Button>
                                    )}
                                    {event.paymentStatus === "Ditolak" && (
                                      <Button
                                        onClick={() => handleReupload(event)}
                                        className="h-9 rounded-lg bg-red-500 px-4 text-xs font-semibold text-white hover:bg-red-600"
                                      >
                                        Upload Ulang
                                      </Button>
                                    )}
                                    {event.paymentStatus ===
                                      "Verifikasi Pembayaran" && (
                                      <span className="font-poppins text-sm font-bold text-neutral-400">
                                        -
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                              {event.paymentStatus === "Ditolak" &&
                                event.rejectionReason && (
                                  <TableRow className="border-sky-100 bg-red-50/30 hover:bg-red-50/30">
                                    <TableCell
                                      colSpan={5}
                                      className="px-6 py-3"
                                    >
                                      <p className="font-poppins text-sm font-medium text-red-500">
                                        Alasan Ditolak: {event.rejectionReason}
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                )}
                            </React.Fragment>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {activeEvents.length === 0 ? (
                      <div className="py-8 text-center font-poppins text-neutral-500">
                        Belum ada lomba aktif.
                      </div>
                    ) : (
                      activeEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex flex-col gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-200">
                              {event.logoUrl ? (
                                <img
                                  src={event.logoUrl}
                                  alt="Logo"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-neutral-400" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-poppins text-sm font-semibold text-neutral-800">
                                {event.eventName}
                              </h3>
                              <p className="font-poppins text-xs font-medium text-neutral-500">
                                {event.teamName}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <PaymentBadge status={event.paymentStatus} />
                            {event.paymentStatus === "Ditolak" &&
                              event.rejectionReason && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                  <p className="font-poppins text-xs font-medium text-red-600">
                                    Alasan Ditolak: {event.rejectionReason}
                                  </p>
                                </div>
                              )}
                            <div className="pt-2">
                              {event.paymentStatus === "Terdaftar" && (
                                <Button
                                  onClick={() =>
                                    handleDashboardAction(event.id)
                                  }
                                  className="h-10 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white hover:bg-blue-600"
                                >
                                  Dashboard Event
                                </Button>
                              )}
                              {event.paymentStatus === "Ditolak" && (
                                <Button
                                  onClick={() => handleReupload(event)}
                                  className="h-10 w-full rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600"
                                >
                                  Upload Ulang Bukti
                                </Button>
                              )}
                              {(event.paymentStatus ===
                                "Verifikasi Pembayaran" ||
                                event.paymentStatus === "Belum Lunas/DP") && (
                                <div className="flex h-10 w-full items-center justify-center rounded-lg bg-neutral-100">
                                  <span className="font-poppins text-xs font-medium text-neutral-500">
                                    Menunggu Tindakan Admin
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* =========================================
            MODAL PENDAFTARAN EVENT (API READY)
            ========================================= */}
        <Dialog
          open={isRegistrationModalOpen}
          onOpenChange={setIsRegistrationModalOpen}
        >
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-xl p-0 sm:rounded-3xl">
            {!selectedEventToRegister && (
              <DialogTitle className="sr-only">Daftar Event</DialogTitle>
            )}
            {selectedEventToRegister && (
              <form onSubmit={submitRegistration} className="flex flex-col">
                {/* Header Dialog */}
                <DialogHeader className="border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-10">
                  <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                    Daftar Event
                  </DialogTitle>
                  <DialogDescription className="text-center font-poppins text-sm text-neutral-400">
                    Lengkapi form pendaftaran untuk mengikuti event
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  {/* Event Summary Card */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-300">
                        {selectedEventToRegister.logoUrl ? (
                          <img
                            src={selectedEventToRegister.logoUrl}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-neutral-500" />
                        )}
                      </div>
                      <h3 className="font-poppins text-base font-semibold text-neutral-800 sm:text-lg">
                        {selectedEventToRegister.title}
                      </h3>
                    </div>

                    <p className="font-poppins text-sm text-neutral-500">
                      {selectedEventToRegister.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2 sm:gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Tanggal:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.date}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Lokasi:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.location}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Kuota Tim:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.quota} tim
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Anggota per Tim:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.memberCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 pt-2">
                      <span className="font-poppins text-sm text-neutral-500">
                        Biaya Event:
                      </span>
                      <span className="font-poppins text-lg font-bold text-blue-500">
                        {formatRupiah(selectedEventToRegister.price)}
                      </span>
                    </div>
                  </div>

                  {/* FIELD: Pilih Tim */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-700">
                      Pilih Tim <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedTeamId}
                      onValueChange={setSelectedTeamId}
                    >
                      <SelectTrigger className="h-12 w-full rounded-lg border-neutral-200 bg-white px-4 font-poppins text-sm text-neutral-700">
                        <SelectValue placeholder="Pilih tim untuk event ini" />
                      </SelectTrigger>
                      <SelectContent>
                        {myTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 font-poppins text-xs text-neutral-400">
                      Jika belum buat tim,{" "}
                      <Link
                        href="/peserta/dashboard/team/new"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        klik di sini untuk buat tim
                      </Link>
                    </p>
                  </div>

                  {/* FIELD: Jenis Pembayaran */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-700">
                      Pilih Jenis Pembayaran{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={paymentType}
                      onValueChange={(v) => setPaymentType(v as "lunas" | "dp")}
                      className="flex flex-col gap-3"
                    >
                      {/* LUNAS */}
                      <Label
                        htmlFor="pay-lunas"
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                          paymentType === "lunas"
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        }`}
                      >
                        <RadioGroupItem
                          value="lunas"
                          id="pay-lunas"
                          className="mt-0.5 border-neutral-300 text-blue-500"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-poppins text-sm font-medium text-neutral-800">
                            Bayar Lunas
                          </span>
                          <span className="font-poppins text-sm font-normal text-neutral-500">
                            Bayar penuh:{" "}
                            <span className="font-semibold text-neutral-700">
                              {formatRupiah(selectedEventToRegister.price)}
                            </span>
                          </span>
                        </div>
                      </Label>

                      {/* DP */}
                      <Label
                        htmlFor="pay-dp"
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                          paymentType === "dp"
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        }`}
                      >
                        <RadioGroupItem
                          value="dp"
                          id="pay-dp"
                          className="mt-0.5 border-neutral-300 text-blue-500"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-poppins text-sm font-medium text-neutral-800">
                            Bayar DP (Down Payment)
                          </span>
                          <span className="font-poppins text-sm font-normal text-neutral-500">
                            Bayar DP 50%:{" "}
                            <span className="font-semibold text-neutral-700">
                              {formatRupiah(selectedEventToRegister.price / 2)}
                            </span>
                          </span>
                          <span className="mt-0.5 font-poppins text-xs text-red-400">
                            Sisa pembayaran dibayar sebelum hari-H event
                          </span>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  {/* FIELD: Upload Bukti */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-700">
                      Upload Bukti Pembayaran{" "}
                      <span className="text-red-500">*</span>
                    </Label>

                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      accept=".jpg,.jpeg,.png,.pdf"
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

                  {/* TOMBOL ACTION (MODAL) */}
                  <div className="mt-4 flex flex-col-reverse items-center gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseRegistrationModal}
                      className="h-12 w-full rounded-full border-neutral-300 font-poppins text-base font-semibold text-neutral-600 hover:bg-neutral-100 sm:flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || !selectedTeamId || !paymentProof
                      }
                      className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Mendaftar...
                        </>
                      ) : (
                        "Daftar Event"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* =========================================
            MODAL UPLOAD ULANG BUKTI PEMBAYARAN
            ========================================= */}
        <Dialog
          open={isReuploadModalOpen}
          onOpenChange={setIsReuploadModalOpen}
        >
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-xl p-0 sm:rounded-3xl">
            {!selectedEventToRegister && (
              <DialogTitle className="sr-only">Upload Ulang Bukti</DialogTitle>
            )}
            {selectedEventToRegister && reuploadActiveEvent && (
              <form onSubmit={submitReupload} className="flex flex-col">
                <DialogHeader className="border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-10">
                  <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                    Upload Ulang Bukti
                  </DialogTitle>
                  <DialogDescription className="text-center font-poppins text-sm text-neutral-400">
                    Silakan upload ulang bukti pembayaran Anda yang ditolak.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  {/* Event Summary Card */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-300">
                        {selectedEventToRegister.logoUrl ? (
                          <img
                            src={selectedEventToRegister.logoUrl}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-neutral-500" />
                        )}
                      </div>
                      <h3 className="font-poppins text-base font-semibold text-neutral-800 sm:text-lg">
                        {selectedEventToRegister.title}
                      </h3>
                    </div>

                    <p className="font-poppins text-sm text-neutral-500">
                      {selectedEventToRegister.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2 sm:gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Tanggal:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.date}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Lokasi:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.location}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Kuota Tim:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.quota} tim
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-poppins text-xs text-neutral-500 sm:text-sm">
                          Anggota per Tim:
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.memberCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 pt-2">
                      <span className="font-poppins text-sm text-neutral-500">
                        Biaya Event:
                      </span>
                      <span className="font-poppins text-lg font-bold text-blue-500">
                        {formatRupiah(selectedEventToRegister.price)}
                      </span>
                    </div>
                  </div>

                  {/* Keterangan Tim & Jenis Pembayaran */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="font-poppins text-sm font-normal text-neutral-700">
                        Tim Anda
                      </Label>
                      <div className="flex h-12 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-4 font-poppins text-sm font-medium text-neutral-800">
                        {reuploadActiveEvent.teamName}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-poppins text-sm font-normal text-neutral-700">
                        Jenis Pembayaran
                      </Label>
                      <div className="flex h-12 items-center justify-between rounded-lg border border-blue-500 bg-blue-50/50 px-4">
                        <span className="font-poppins text-sm font-semibold text-blue-700">
                          {reuploadActiveEvent.paymentType === "dp"
                            ? "Bayar DP (Down Payment)"
                            : "Bayar Lunas"}
                        </span>
                        <span className="font-poppins text-sm font-bold text-blue-700">
                          {reuploadActiveEvent.paymentType === "dp"
                            ? formatRupiah(selectedEventToRegister.price / 2)
                            : formatRupiah(selectedEventToRegister.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FIELD: Upload Bukti */}
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-700">
                      Upload Bukti Pembayaran{" "}
                      <span className="text-red-500">*</span>
                    </Label>

                    <input
                      type="file"
                      className="hidden"
                      ref={reuploadFileInputRef}
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleReuploadFileChange}
                    />

                    <div
                      onClick={() => reuploadFileInputRef.current?.click()}
                      className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50 sm:p-8"
                    >
                      {reuploadProof ? (
                        <>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <p className="max-w-[200px] truncate font-poppins text-sm font-semibold text-neutral-800 sm:max-w-xs">
                              {reuploadProof.name}
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

                  {/* TOMBOL ACTION (MODAL) */}
                  <div className="mt-4 flex flex-col-reverse items-center gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseReuploadModal}
                      className="h-12 w-full rounded-full border-neutral-300 font-poppins text-base font-semibold text-neutral-600 hover:bg-neutral-100 sm:flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isReuploading || !reuploadProof}
                      className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:flex-1"
                    >
                      {isReuploading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Uploading...
                        </>
                      ) : (
                        "Upload Bukti"
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
