"use client"

import React, { useState, useRef, useTransition } from "react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

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
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { OpenEvent, ActiveEvent } from "@/schemas/participant-event.schema"
import { ParticipantTeamRes } from "@/schemas/team.schema"
import {
  registerEventAction,
  pelunasanEventAction,
} from "@/actions/participant-event.actions"

export type EventStatus = "OPEN" | "CLOSED" | "DRAFT" | "ARCHIVED" | string

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ status }: { status: EventStatus }) {
  const isOpen = status === "OPEN"
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

function PaymentBadge({ 
  status, 
  isKick, 
  rejectionReason 
}: { 
  status: string, 
  isKick?: boolean, 
  rejectionReason?: string | null 
}) {
  if (isKick || status === "KICKED") {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex w-full max-w-[180px] items-center justify-center rounded-xl border border-red-400 bg-red-50 px-3 py-1.5 text-red-600">
          <span className="truncate font-poppins text-xs font-medium">
            Dikeluarkan
          </span>
        </div>
        <span className="max-w-[180px] text-center font-poppins text-[10px] text-red-500 line-clamp-2">
          Anda telah dikeluarkan dari event ini. Silakan daftar kembali jika diperlukan.
        </span>
      </div>
    )
  }

  const styles: Record<string, string> = {
    WAITING: "bg-yellow-50 border-yellow-400 text-yellow-600",
    DP_PAID: "bg-blue-50 border-blue-300 text-blue-500",
    FULL_PAID: "bg-green-50 border-green-400 text-green-600",
    REJECTED: "bg-red-50 border-red-500 text-red-600",
    KICKED: "bg-red-50 border-red-400 text-red-600",
  }

  const label: Record<string, string> = {
    WAITING: "Verifikasi Pembayaran",
    DP_PAID: "DP Diterima",
    FULL_PAID: "Terdaftar",
    REJECTED: "Ditolak",
    KICKED: "Dikeluarkan",
  }

  const displayStatus = label[status] || status
  const badgeClass =
    styles[status] || "bg-gray-50 border-gray-400 text-gray-600"

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex w-full max-w-[180px] items-center justify-center rounded-xl border px-3 py-1.5 ${badgeClass}`}
      >
        <span className="truncate font-poppins text-xs font-medium">
          {displayStatus}
        </span>
      </div>
      {status === "REJECTED" && rejectionReason && (
        <span className="max-w-[180px] text-center font-poppins text-[10px] text-red-500 line-clamp-2 italic">
          "{rejectionReason}"
        </span>
      )}
    </div>
  )
}

interface MyEventClientProps {
  initialOpenEvents: OpenEvent[]
  initialActiveEvents: ActiveEvent[]
  myTeams: ParticipantTeamRes[]
}

export default function MyEventClient({
  initialOpenEvents,
  initialActiveEvents,
  myTeams,
}: MyEventClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] =
    useState<boolean>(false)
  const [selectedEventToRegister, setSelectedEventToRegister] =
    useState<OpenEvent | null>(null)

  const [selectedTeamId, setSelectedTeamId] = useState<string>("")
  const [paymentType, setPaymentType] = useState<"lunas" | "dp">("lunas")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState<boolean>(false)
  const [reuploadActiveEvent, setReuploadActiveEvent] =
    useState<ActiveEvent | null>(null)
  const [reuploadProof, setReuploadProof] = useState<File | null>(null)
  const [isReuploading, setIsReuploading] = useState<boolean>(false)
  const reuploadFileInputRef = useRef<HTMLInputElement>(null)

  const handleOpenRegistrationModal = (event: OpenEvent) => {
    setSelectedEventToRegister(event)
    setIsRegistrationModalOpen(true)
    setSelectedTeamId("")
    setPaymentType("lunas")
    setPaymentProof(null)
  }

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false)
    setTimeout(() => setSelectedEventToRegister(null), 300)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleDashboardAction = (regisId: string) => {
    router.push(`/peserta/dashboard/event/${regisId}/overview`)
  }

  const handleReuploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReuploadProof(e.target.files[0])
    }
  }

  const handleReupload = (activeEvent: ActiveEvent) => {
    const matchedEvent = initialOpenEvents.find(
      (e) => e.name === activeEvent.event_name
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

    const formData = new FormData()
    formData.append("payment_proof", reuploadProof)

    const res = await pelunasanEventAction(
      reuploadActiveEvent.registration_id,
      formData
    )
    setIsReuploading(false)

    if (res.success) {
      alert(res.message)
      handleCloseReuploadModal()
      startTransition(() => {
        router.refresh()
      })
    } else {
      alert(res.message)
    }
  }

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEventToRegister || !selectedTeamId || !paymentProof) {
      alert("Harap lengkapi semua field yang wajib!")
      return
    }

    setIsSubmitting(true)

    // 1. Check if team is already registered for this event (and not kicked)
    const existingRegistration = initialActiveEvents.find(
      (ae) => 
        ae.event_name === selectedEventToRegister.name && 
        ae.team_name === myTeams.find(t => t.id === selectedTeamId)?.name &&
        !ae.is_kick && 
        ae.payment_status !== "KICKED" &&
        (ae.payment_status === "WAITING" || ae.payment_status === "DP_PAID" || ae.payment_status === "FULL_PAID")
    )

    if (existingRegistration) {
      alert("Tim ini sudah terdaftar di event ini!")
      setIsSubmitting(false)
      return
    }

    // 2. Validate member count
    const selectedTeam = myTeams.find(t => t.id === selectedTeamId)
    if (selectedTeam) {
      const minMembers = selectedEventToRegister.min_team_members || 0
      const maxMembers = selectedEventToRegister.max_team_members || 999
      if (selectedTeam.members_count < minMembers || selectedTeam.members_count > maxMembers) {
        alert(`Jumlah anggota tim (${selectedTeam.members_count}) tidak sesuai dengan syarat event (${minMembers}-${maxMembers} anggota).`)
        setIsSubmitting(false)
        return
      }
    }

    const levelId = selectedEventToRegister.levels?.[0]?.id

    if (!levelId) {
      alert("Event ini tidak memiliki level kompetisi")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append("event_level_id", levelId)
    formData.append("team_id", selectedTeamId)
    formData.append("payment_type", paymentType)
    formData.append("payment_proof", paymentProof)

    const res = await registerEventAction(formData)
    setIsSubmitting(false)

    if (res.success) {
      alert(res.message)
      handleCloseRegistrationModal()
      startTransition(() => {
        router.refresh()
      })
    } else {
      alert(res.message)
    }
  }

  // Filter exploreEvents based on searchQuery and locationFilter
  const exploreEvents = initialOpenEvents.filter((ev) => {
    if (
      searchQuery &&
      !ev.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (
      locationFilter !== "all" &&
      ev.location &&
      !ev.location.toLowerCase().includes(locationFilter.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const logo_path = selectedEventToRegister?.logo_path
    ? selectedEventToRegister?.logo_path.startsWith("http")
      ? selectedEventToRegister?.logo_path
      : process.env.NEXT_PUBLIC_API_URL +
        "/" +
        selectedEventToRegister?.logo_path
    : null
  const poster_path = selectedEventToRegister?.poster_path
    ? selectedEventToRegister?.poster_path.startsWith("http")
      ? selectedEventToRegister?.poster_path
      : process.env.NEXT_PUBLIC_API_URL +
        "/" +
        selectedEventToRegister?.poster_path
    : null

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:gap-10 md:p-6 lg:p-8">
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          My Event
        </h1>

        <Tabs
          defaultValue="active"
          className="flex w-full flex-col gap-6 md:gap-8"
        >
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

          <TabsContent
            value="explore"
            className="m-0 flex flex-col gap-6 outline-none"
          >
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {exploreEvents.map((event) => {
                const logo_path = event.logo_path
                  ? event.logo_path.startsWith("http")
                    ? event.logo_path
                    : process.env.NEXT_PUBLIC_API_URL + "/" + event.logo_path
                  : null
                return (
                  <div
                    key={event.id}
                    className="flex flex-col gap-6 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/40 p-5 shadow-sm backdrop-blur-sm md:p-6"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-200">
                            {logo_path ? (
                              <img
                                src={logo_path}
                                alt="Logo"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <h3 className="line-clamp-1 font-poppins text-base font-semibold text-slate-900">
                              {event.name}
                            </h3>
                            <p className="font-poppins text-xs font-medium text-neutral-500">
                              {event.organizer}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={event.status || "OPEN"} />
                      </div>

                      <p className="line-clamp-2 font-poppins text-sm text-neutral-500">
                        {event.description}
                      </p>

                      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white/60 p-4 md:p-5">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 shrink-0 text-neutral-500" />
                          <span className="font-poppins text-sm text-neutral-600">
                            {format(new Date(event.open_date), "d MMMM yyyy")} s/d {format(new Date(event.close_date), "d MMMM yyyy")}
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
                            {formatRupiah(
                              parseInt(event.levels?.[0]?.regis_fee || "0")
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenRegistrationModal(event)}
                      disabled={event.status === "CLOSED"}
                      className="h-12 w-full rounded-full bg-red-400 text-base font-bold text-white shadow-sm transition-colors hover:bg-red-500 disabled:opacity-50"
                    >
                      Daftar Sekarang
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="active" className="m-0 outline-none">
            <div className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-sm md:p-6">
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
                    {initialActiveEvents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center font-poppins text-neutral-500"
                        >
                          Belum ada lomba aktif.
                        </TableCell>
                      </TableRow>
                    ) : (
                      initialActiveEvents.map((event) => {
                        const logo_path = event.event_logo_path
                          ? event.event_logo_path.startsWith("http")
                            ? event.event_logo_path
                            : process.env.NEXT_PUBLIC_API_URL +
                              "/" +
                              event.event_logo_path
                          : null
                        return (
                          <React.Fragment key={event.registration_id}>
                            <TableRow
                              className={`border-sky-100 bg-transparent hover:bg-white/50 ${event.payment_status === "REJECTED" ? "border-b-0" : ""}`}
                            >
                              <TableCell className="p-4">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-stone-200">
                                  {logo_path ? (
                                    <img
                                      src={logo_path}
                                      alt="Logo"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="h-5 w-5 text-neutral-400" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-poppins text-sm font-medium text-neutral-800">
                                {event.event_name}
                              </TableCell>
                              <TableCell className="text-center font-poppins text-sm text-neutral-600">
                                {event.team_name}
                              </TableCell>
                              <TableCell className="p-4">
                                <div className="flex justify-center">
                                  <PaymentBadge 
                                    status={event.payment_status} 
                                    isKick={event.is_kick}
                                    rejectionReason={event.rejection_reason}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="p-4">
                                <div className="flex justify-center gap-2">
                                  {(event.payment_status === "FULL_PAID" ||
                                    event.payment_status === "DP_PAID") && !event.is_kick && (
                                    <Button
                                      onClick={() =>
                                        handleDashboardAction(
                                          event.registration_id
                                        )
                                      }
                                      className="h-9 rounded-lg bg-blue-500 px-4 text-xs font-semibold text-white hover:bg-blue-600"
                                    >
                                      Overview
                                    </Button>
                                  )}
                                  {(event.payment_status === "REJECTED" || event.payment_status === "KICKED" || event.is_kick) && (
                                    <Button
                                      onClick={() => {
                                        if (event.is_kick || event.payment_status === "KICKED") {
                                          const matchedEvent = initialOpenEvents.find(e => e.name === event.event_name)
                                          if (matchedEvent) handleOpenRegistrationModal(matchedEvent)
                                        } else {
                                          handleReupload(event)
                                        }
                                      }}
                                      className="h-9 rounded-lg bg-red-500 px-4 text-xs font-semibold text-white hover:bg-red-600"
                                    >
                                      {event.is_kick || event.payment_status === "KICKED" ? "Daftar Ulang" : "Upload Ulang"}
                                    </Button>
                                  )}
                                  {event.payment_status === "WAITING" && !event.is_kick && (
                                    <span className="font-poppins text-sm font-bold text-neutral-400">
                                      -
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-4 md:hidden">
                {initialActiveEvents.length === 0 ? (
                  <div className="py-8 text-center font-poppins text-neutral-500">
                    Belum ada lomba aktif.
                  </div>
                ) : (
                  initialActiveEvents.map((event) => (
                    <div
                      key={event.registration_id}
                      className="flex flex-col gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-200">
                          {event.event_logo_path ? (
                            <img
                              src={
                                event.event_logo_path.startsWith("/")
                                  ? process.env.NEXT_PUBLIC_API_URL +
                                    event.event_logo_path
                                  : event.event_logo_path
                              }
                              alt="Logo"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-poppins text-sm font-semibold text-neutral-800">
                            {event.event_name}
                          </h3>
                          <p className="font-poppins text-xs font-medium text-neutral-500">
                            {event.team_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <PaymentBadge 
                          status={event.payment_status} 
                          isKick={event.is_kick}
                          rejectionReason={event.rejection_reason}
                        />
                        <div className="pt-2">
                          {(event.payment_status === "FULL_PAID" ||
                            event.payment_status === "DP_PAID") && !event.is_kick && (
                            <Button
                              onClick={() =>
                                handleDashboardAction(event.registration_id)
                              }
                              className="h-10 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white hover:bg-blue-600"
                            >
                              Dashboard Event
                            </Button>
                          )}
                          {(event.payment_status === "REJECTED" || event.payment_status === "KICKED" || event.is_kick) && (
                            <Button
                              onClick={() => {
                                if (event.is_kick || event.payment_status === "KICKED") {
                                  const matchedEvent = initialOpenEvents.find(e => e.name === event.event_name)
                                  if (matchedEvent) handleOpenRegistrationModal(matchedEvent)
                                } else {
                                  handleReupload(event)
                                }
                              }}
                              className="h-10 w-full rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600"
                            >
                              {event.is_kick || event.payment_status === "KICKED" ? "Daftar Ulang (Pendaftaran Baru)" : "Upload Ulang Bukti"}
                            </Button>
                          )}
                          {event.payment_status === "WAITING" && !event.is_kick && (
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
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={isRegistrationModalOpen}
          onOpenChange={setIsRegistrationModalOpen}
        >
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-xl p-0 sm:rounded-3xl border-none">
            <DialogTitle className="sr-only">
              {selectedEventToRegister?.name ?? "Pendaftaran Event"}
            </DialogTitle>
            {selectedEventToRegister && (
              <form onSubmit={submitRegistration} className="flex flex-col">
                <div className="relative h-48 w-full overflow-hidden sm:h-64">
                  {poster_path ? (
                    <img
                      src={poster_path}
                      alt="Poster Event"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-sky-100">
                      <ImageIcon className="h-12 w-12 text-sky-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10">
                    <h3 className="font-montserrat text-xl font-bold text-white sm:text-2xl">
                      {selectedEventToRegister.name}
                    </h3>
                    <p className="font-poppins text-sm text-sky-100 line-clamp-1">
                      {selectedEventToRegister.organizer}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 p-6 sm:p-10">
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/50 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-2 font-poppins text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5" /> Tanggal
                        </Label>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {format(new Date(selectedEventToRegister.open_date || new Date()), "d MMMM yyyy")} - {format(new Date(selectedEventToRegister.close_date || new Date()), "d MMMM yyyy")}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-2 font-poppins text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          <MapPin className="h-3.5 w-3.5" /> Lokasi
                        </Label>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedEventToRegister.location}
                        </span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-sky-100" />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-2 font-poppins text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          <Banknote className="h-3.5 w-3.5" /> Pembayaran
                        </Label>
                        <div className="flex flex-col">
                          <span className="font-poppins text-sm font-bold text-blue-600">
                            {selectedEventToRegister.bank_name || "-"}: {selectedEventToRegister.bank_number || "-"}
                          </span>
                          <span className="font-poppins text-[10px] text-neutral-400">
                            A/N: {selectedEventToRegister.organizer}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="flex items-center gap-2 font-poppins text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          <AlertCircle className="h-3.5 w-3.5" /> Kontak (PJ)
                        </Label>
                        <div className="flex flex-col">
                          <span className="font-poppins text-sm font-medium text-neutral-800">
                            {selectedEventToRegister.name_pj || "-"}
                          </span>
                          <span className="font-poppins text-xs text-blue-500 font-semibold">
                            {selectedEventToRegister.no_wa_pj || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-poppins text-sm font-semibold text-neutral-800">
                        Pilih Tim <span className="text-red-500">*</span>
                      </Label>
                      <span className="font-poppins text-[10px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                        Syarat: {selectedEventToRegister.min_team_members}-{selectedEventToRegister.max_team_members} Anggota
                      </span>
                    </div>
                    <Select
                      value={selectedTeamId}
                      onValueChange={setSelectedTeamId}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border-neutral-200 bg-white px-4 font-poppins text-sm text-neutral-700 shadow-sm focus:ring-blue-100 transition-all">
                        <SelectValue placeholder="Pilih tim untuk event ini" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-sky-100 shadow-lg">
                        {myTeams.map((team) => {
                          const isAlreadyInEvent = initialActiveEvents.some(
                            (ae) => 
                              ae.event_name === selectedEventToRegister.name && 
                              ae.team_name === team.name &&
                              !ae.is_kick &&
                              ae.payment_status !== "KICKED" &&
                              (ae.payment_status === "WAITING" || ae.payment_status === "DP_PAID" || ae.payment_status === "FULL_PAID")
                          )

                          const minMembers = selectedEventToRegister.min_team_members || 0
                          const maxMembers = selectedEventToRegister.max_team_members || 999
                          const isInvalidSize = team.members_count < minMembers || team.members_count > maxMembers

                          return (
                            <SelectItem 
                              key={team.id} 
                              value={team.id} 
                              disabled={isAlreadyInEvent}
                              className="font-poppins text-sm py-3 focus:bg-sky-50"
                            >
                              <div className="flex flex-col">
                                <span className={isAlreadyInEvent ? "text-neutral-400" : isInvalidSize ? "text-red-500" : ""}>
                                  {team.name} {isAlreadyInEvent ? "(Sudah Terdaftar)" : isInvalidSize ? "(Anggota Tidak Sesuai)" : ""}
                                </span>
                                <span className={`text-[10px] ${isInvalidSize ? "text-red-400" : "text-neutral-400"}`}>
                                  Anggota: {team.members_count} orang {isInvalidSize ? `(Butuh ${minMembers}-${maxMembers})` : ""}
                                </span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    
                    {selectedTeamId && (() => {
                      const team = myTeams.find(t => t.id === selectedTeamId)
                      const min = selectedEventToRegister.min_team_members || 0
                      const max = selectedEventToRegister.max_team_members || 999
                      const count = team?.members_count || 0
                      if (count < min || count > max) {
                        return (
                          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="font-poppins text-xs font-medium">
                              Tim ini tidak bisa didaftarkan karena jumlah anggota ({count}) tidak memenuhi syarat ({min}-{max}).
                            </p>
                          </div>
                        )
                      }
                      return null
                    })()}

                    <p className="mt-1 font-poppins text-xs text-neutral-400">
                      Jika belum buat tim atau ingin daftar dengan tim baru,{" "}
                      <Link
                        href="/peserta/dashboard/team/new"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        klik di sini untuk buat tim
                      </Link>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="font-poppins text-sm font-semibold text-neutral-800">
                      Pilih Jenis Pembayaran <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={paymentType}
                      onValueChange={(v) => setPaymentType(v as "lunas" | "dp")}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                      <Label
                        htmlFor="pay-lunas"
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${paymentType === "lunas" ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-50" : "border-neutral-200 bg-white hover:border-blue-200 hover:bg-neutral-50"}`}
                      >
                        <RadioGroupItem
                          value="lunas"
                          id="pay-lunas"
                          className="mt-0.5 border-neutral-300 text-blue-500"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-poppins text-sm font-bold text-neutral-800">
                            Bayar Lunas
                          </span>
                          <span className="font-poppins text-xs font-semibold text-blue-600">
                            {formatRupiah(
                              parseInt(
                                selectedEventToRegister.levels?.[0]
                                  ?.regis_fee || "0"
                              )
                            )}
                          </span>
                        </div>
                      </Label>
                      <Label
                        htmlFor="pay-dp"
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${paymentType === "dp" ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-50" : "border-neutral-200 bg-white hover:border-blue-200 hover:bg-neutral-50"}`}
                      >
                        <RadioGroupItem
                          value="dp"
                          id="pay-dp"
                          className="mt-0.5 border-neutral-300 text-blue-500"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-poppins text-sm font-bold text-neutral-800">
                            Bayar DP
                          </span>
                          <span className="font-poppins text-xs font-semibold text-blue-600">
                            {formatRupiah(
                              parseInt(
                                selectedEventToRegister.levels?.[0]?.dp_fee ||
                                  "0"
                              )
                            )}
                          </span>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="font-poppins text-sm font-semibold text-neutral-800">
                      Bukti Pembayaran <span className="text-red-500">*</span>
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
                      className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all p-6 ${paymentProof ? "border-green-300 bg-green-50/50" : "border-neutral-200 bg-neutral-50/50 hover:border-blue-300 hover:bg-blue-50/30"}`}
                    >
                      {paymentProof ? (
                        <>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <p className="max-w-[240px] truncate font-poppins text-sm font-semibold text-neutral-800">
                              {paymentProof.name}
                            </p>
                            <p className="font-poppins text-[10px] text-green-600 font-medium">
                              Klik untuk mengganti file
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-colors group-hover:bg-blue-100">
                            <UploadCloud className="h-5 w-5 text-neutral-400 group-hover:text-blue-500" />
                          </div>
                          <p className="font-poppins text-xs font-medium text-neutral-500">
                            Klik atau seret bukti transfer ke sini
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col-reverse items-center gap-4 sm:flex-row">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCloseRegistrationModal}
                      className="h-12 w-full rounded-xl font-poppins text-sm font-semibold text-neutral-500 hover:bg-neutral-100 sm:flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        !selectedTeamId || 
                        !paymentProof ||
                        (() => {
                          const team = myTeams.find(t => t.id === selectedTeamId)
                          const min = selectedEventToRegister.min_team_members || 0
                          const max = selectedEventToRegister.max_team_members || 999
                          const count = team?.members_count || 0
                          return count < min || count > max
                        })()
                      }
                      className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 font-poppins text-sm font-bold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 sm:flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Memproses...
                        </>
                      ) : (
                        "Selesaikan Pendaftaran"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isReuploadModalOpen}
          onOpenChange={setIsReuploadModalOpen}
        >
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-xl p-0 sm:rounded-3xl">
            {selectedEventToRegister && reuploadActiveEvent && (
              <form onSubmit={submitReupload} className="flex flex-col">
                <DialogHeader className="border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-10">
                  <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                    Upload Ulang Bukti
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-300">
                        {logo_path ? (
                          <img
                            src={logo_path}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-neutral-500" />
                        )}
                      </div>
                      <h3 className="font-poppins text-base font-semibold text-neutral-800 sm:text-lg">
                        {selectedEventToRegister.name}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="font-poppins text-sm font-normal text-neutral-700">
                        Tim Anda
                      </Label>
                      <div className="flex h-12 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-4 font-poppins text-sm font-medium text-neutral-800">
                        {reuploadActiveEvent.team_name}
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
                        </>
                      )}
                    </div>
                  </div>

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
