"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  UploadCloud,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
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

export interface EventCategory {
  id: string
  name: string
  totalQuota: number
  registered: number
  remaining: number
  registrationFee: number
  downPayment: number
}

export interface EventData {
  namaEvent: string
  penyelenggara: string
  email: string
  deskripsi: string
  bukaPendaftaran: string
  tutupPendaftaran: string
  pelaksanaanLomba: string
  lokasi: string
  kuotaTim: number
  minAnggota: number
  maxAnggota: number
  waPanitia: string
  penanggungJawab: string
  linkGrupWa: string
  namaBank: string
  atasNama: string
  nomorRekening: string
  logoUrl: string
  logoFile: File | null // Disiapkan untuk payload API Multipart/FormData
  posterUrl: string
  posterFile: File | null // Disiapkan untuk payload API Multipart/FormData
  categories: EventCategory[]
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_EVENT_DATA: EventData = {
  namaEvent: "Lomba Gerak Jalan Nasional 2025",
  penyelenggara: "SMAN 1 Jakarta",
  email: "admin@paskihub.com",
  deskripsi:
    "Kompetisi gerak jalan tingkat nasional untuk kategori pelajar dan umum. Event ini bertujuan untuk mengembangkan disiplin, kekompakan, dan jiwa patriotisme melalui lomba gerak jalan yang kompetitif dan edukatif.",
  bukaPendaftaran: "2026-06-01",
  tutupPendaftaran: "2026-08-10",
  pelaksanaanLomba: "2026-08-18",
  lokasi: "Lapangan Merdeka, Jakarta Pusat",
  kuotaTim: 55,
  minAnggota: 10,
  maxAnggota: 25,
  waPanitia: "+62 812-3456-7890",
  penanggungJawab: "Ahmad Fauzi, S.Pd",
  linkGrupWa: "https://chat.whatsapp.com/xxxxx",
  namaBank: "BCA",
  atasNama: "Panitia Lomba GJ 2025",
  nomorRekening: "1234567890",
  logoUrl: "",
  logoFile: null,
  posterUrl: "",
  posterFile: null,
  categories: [
    {
      id: "c1",
      name: "SD (Sekolah Dasar)",
      totalQuota: 50,
      registered: 32,
      remaining: 18,
      registrationFee: 150000,
      downPayment: 75000,
    },
    {
      id: "c2",
      name: "SMP (Sekolah Menengah Pertama)",
      totalQuota: 45,
      registered: 28,
      remaining: 17,
      registrationFee: 200000,
      downPayment: 100000,
    },
    {
      id: "c3",
      name: "SMA (Sekolah Menengah Atas)",
      totalQuota: 40,
      registered: 35,
      remaining: 5,
      registrationFee: 250000,
      downPayment: 125000,
    },
    {
      id: "c4",
      name: "PURNA (Paskibra Purna)",
      totalQuota: 30,
      registered: 12,
      remaining: 18,
      registrationFee: 300000,
      downPayment: 150000,
    },
    {
      id: "c5",
      name: "UMUM (Kategori Umum)",
      totalQuota: 25,
      registered: 8,
      remaining: 17,
      registrationFee: 350000,
      downPayment: 175000,
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

function InfoSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6">
      <h3 className="font-poppins text-lg font-medium text-slate-900">
        {title}
      </h3>
      <div className="w-full">{children}</div>
    </div>
  )
}

function EditableField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  className,
  placeholder,
}: {
  label: string
  value: string | number
  isEditing: boolean
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  type?: "text" | "textarea" | "number" | "email" | "date"
  className?: string
  placeholder?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="font-poppins text-sm font-normal text-neutral-500">
        {label}
      </Label>
      {isEditing ? (
        type === "textarea" ? (
          <Textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="min-h-[100px] resize-y bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
          />
        )
      ) : (
        <div className="font-poppins text-sm font-semibold text-neutral-700">
          {value || "-"}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, isEditing, onChange, description }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
      {isEditing ? (
        <Input
          type="number"
          value={value}
          onChange={onChange}
          className="h-10 w-24 text-center font-poppins text-lg font-bold focus-visible:ring-sky-200"
        />
      ) : (
        <span className="font-poppins text-xl font-semibold text-neutral-700">
          {value}
        </span>
      )}
      <span className="mt-1 text-center font-poppins text-sm font-normal text-neutral-700">
        {label}
      </span>
      {description && (
        <span className="text-center font-poppins text-xs font-normal text-neutral-400">
          {description}
        </span>
      )}
    </div>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function OrganizerEventDetailPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<EventData | null>(null)

  // Referensi untuk file input
  const logoInputRef = useRef<HTMLInputElement>(null)
  const posterInputRef = useRef<HTMLInputElement>(null)

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/events/{id} di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setFormData(MOCK_EVENT_DATA)
      } catch (error) {
        console.error("Gagal memuat data event:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEventData()
  }, [])

  // --- HANDLERS TEXT & CATEGORIES ---
  const handleChange =
    (field: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!formData) return
      setFormData({ ...formData, [field]: e.target.value })
    }

  const handleCategoryChange = (
    id: string,
    field: keyof EventCategory,
    value: string | number
  ) => {
    if (!formData) return
    setFormData({
      ...formData,
      categories: formData.categories.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      ),
    })
  }

  const handleAddCategory = () => {
    if (!formData) return
    const newCategory: EventCategory = {
      id: `new-${Date.now()}`,
      name: "",
      totalQuota: 0,
      registered: 0,
      remaining: 0,
      registrationFee: 0,
      downPayment: 0,
    }
    setFormData({
      ...formData,
      categories: [...formData.categories, newCategory],
    })
  }

  const handleRemoveCategory = (id: string) => {
    if (!formData) return
    setFormData({
      ...formData,
      categories: formData.categories.filter((cat) => cat.id !== id),
    })
  }

  // --- HANDLERS FILE UPLOAD ---
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && formData) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        logoFile: file,
        logoUrl: URL.createObjectURL(file), // Buat temporary preview URL
      })
    }
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && formData) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        posterFile: file,
        posterUrl: URL.createObjectURL(file), // Buat temporary preview URL
      })
    }
  }

  // --- HANDLERS ACTION ---
  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Gunakan FormData() asli untuk mengunggah file (multipart/form-data) ke API
      // const apiPayload = new FormData();
      // apiPayload.append('namaEvent', formData.namaEvent);
      // if (formData.logoFile) apiPayload.append('logo', formData.logoFile);
      // if (formData.posterFile) apiPayload.append('poster', formData.posterFile);
      // dst...

      console.log("=== PAYLOAD UPDATE EVENT ===", formData)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Perubahan dan file berhasil disimpan!")
      setIsEditing(false)
    } catch (error) {
      console.error("Gagal menyimpan data:", error)
      alert("Terjadi kesalahan saat menyimpan perubahan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Revert changes by re-fetching or resetting to a deep clone of original data
    setIsEditing(false)
    setFormData(MOCK_EVENT_DATA) // Simplifikasi: reset ke mock awal
  }

  // --- ERROR STATE UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER & ACTIONS */}
        <div className="flex flex-col gap-6">
          <Link
            href="/organizer/dashboard"
            className="flex w-fit items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-montserrat text-base font-semibold md:text-lg">
              Kembali
            </span>
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
              My Event
            </h1>
            {formData && !isLoading && (
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="rounded-full px-6 font-poppins font-semibold"
                    >
                      <X className="mr-2 h-4 w-4" /> Batal
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="rounded-full bg-red-400 px-6 font-poppins font-bold text-white hover:bg-red-500"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Simpan Perubahan
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full border-blue-500 px-6 font-poppins font-semibold text-blue-500 hover:bg-blue-50"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit Event
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT SKELETON */}
        {isLoading || !formData ? (
          <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-b from-white/60 to-white/50 p-6 shadow-sm">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-50 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm md:p-6">
            <div className="px-2 pb-2">
              <h2 className="font-poppins text-lg font-medium text-slate-900">
                Info Dasar Event
              </h2>
            </div>

            {/* Identitas Event */}
            <InfoSection title="Identitas Event">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <EditableField
                  label="Nama Event"
                  value={formData.namaEvent}
                  isEditing={isEditing}
                  onChange={handleChange("namaEvent")}
                />
                <EditableField
                  label="Penyelenggara"
                  value={formData.penyelenggara}
                  isEditing={isEditing}
                  onChange={handleChange("penyelenggara")}
                />
                <EditableField
                  label="Email"
                  type="email"
                  value={formData.email}
                  isEditing={isEditing}
                  onChange={handleChange("email")}
                />
                <EditableField
                  label="Deskripsi Event"
                  type="textarea"
                  value={formData.deskripsi}
                  isEditing={isEditing}
                  onChange={handleChange("deskripsi")}
                  className="md:col-span-2 lg:col-span-3"
                />
              </div>
            </InfoSection>

            {/* Jadwal dan Lokasi */}
            <InfoSection title="Jadwal dan Lokasi">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <EditableField
                  type="date"
                  label="Pendaftaran Dibuka"
                  value={formData.bukaPendaftaran}
                  isEditing={isEditing}
                  onChange={handleChange("bukaPendaftaran")}
                />
                <EditableField
                  type="date"
                  label="Pendaftaran Ditutup"
                  value={formData.tutupPendaftaran}
                  isEditing={isEditing}
                  onChange={handleChange("tutupPendaftaran")}
                />
                <EditableField
                  type="date"
                  label="Pelaksanaan Lomba"
                  value={formData.pelaksanaanLomba}
                  isEditing={isEditing}
                  onChange={handleChange("pelaksanaanLomba")}
                />
                <EditableField
                  label="Lokasi"
                  value={formData.lokasi}
                  isEditing={isEditing}
                  onChange={handleChange("lokasi")}
                  className="sm:col-span-3"
                />
              </div>
            </InfoSection>

            {/* Ketentuan Peserta */}
            <InfoSection title="Ketentuan Peserta">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  label="Total Kuota Tim"
                  value={formData.kuotaTim}
                  isEditing={isEditing}
                  onChange={handleChange("kuotaTim")}
                  description="Total dari semua kategori"
                />
                <StatCard
                  label="Min. Anggota per Tim"
                  value={formData.minAnggota}
                  isEditing={isEditing}
                  onChange={handleChange("minAnggota")}
                  description="Minimal anggota per tim"
                />
                <StatCard
                  label="Max. Anggota per Tim"
                  value={formData.maxAnggota}
                  isEditing={isEditing}
                  onChange={handleChange("maxAnggota")}
                  description="Maksimal anggota per tim"
                />
              </div>
            </InfoSection>

            {/* Informasi Kontak */}
            <InfoSection title="Informasi Kontak">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EditableField
                  label="WhatsApp Panitia"
                  value={formData.waPanitia}
                  isEditing={isEditing}
                  onChange={handleChange("waPanitia")}
                />
                <EditableField
                  label="Grup WhatsApp Peserta"
                  value={formData.linkGrupWa}
                  isEditing={isEditing}
                  onChange={handleChange("linkGrupWa")}
                />
                <EditableField
                  label="Penanggung Jawab"
                  value={formData.penanggungJawab}
                  isEditing={isEditing}
                  onChange={handleChange("penanggungJawab")}
                  className="md:col-span-2"
                />
              </div>
            </InfoSection>

            {/* Pembayaran */}
            <InfoSection title="Pembayaran">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EditableField
                  label="Nama Bank"
                  value={formData.namaBank}
                  isEditing={isEditing}
                  onChange={handleChange("namaBank")}
                />
                <EditableField
                  label="Nomor Rekening"
                  type="number"
                  value={formData.nomorRekening}
                  isEditing={isEditing}
                  onChange={handleChange("nomorRekening")}
                />
                <EditableField
                  label="Atas Nama"
                  value={formData.atasNama}
                  isEditing={isEditing}
                  onChange={handleChange("atasNama")}
                  className="md:col-span-2"
                />
              </div>
            </InfoSection>

            {/* Aset Media Event (UPLOAD FILE) */}
            <InfoSection title="Aset Media Event">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* UPLOAD LOGO */}
                <div className="flex flex-col gap-2">
                  <span className="font-poppins text-sm font-normal text-neutral-500">
                    Logo Event
                  </span>
                  <div className="flex flex-col items-start gap-2">
                    {/* Hidden input type file */}
                    <input
                      type="file"
                      className="hidden"
                      ref={logoInputRef}
                      accept=".jpg,.jpeg,.png"
                      onChange={handleLogoChange}
                    />
                    <div
                      onClick={() => isEditing && logoInputRef.current?.click()}
                      className={cn(
                        "flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-stone-300 bg-neutral-100 transition-all",
                        isEditing
                          ? "cursor-pointer hover:border-blue-400 hover:bg-neutral-200"
                          : ""
                      )}
                    >
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="rounded-full bg-white p-2 shadow-sm">
                            <UploadCloud className="h-5 w-5 text-neutral-500" />
                          </div>
                          {isEditing && (
                            <span className="font-montserrat text-xs text-neutral-500">
                              Klik untuk unggah
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <span className="font-poppins text-xs text-neutral-400">
                        Format: JPG, PNG (Max 5MB)
                      </span>
                    )}
                  </div>
                </div>

                {/* UPLOAD POSTER */}
                <div className="flex flex-col gap-2">
                  <span className="font-poppins text-sm font-normal text-neutral-500">
                    Poster Event
                  </span>
                  <div className="flex flex-col items-start gap-2">
                    {/* Hidden input type file */}
                    <input
                      type="file"
                      className="hidden"
                      ref={posterInputRef}
                      accept=".jpg,.jpeg,.png"
                      onChange={handlePosterChange}
                    />
                    <div
                      onClick={() =>
                        isEditing && posterInputRef.current?.click()
                      }
                      className={cn(
                        "flex h-32 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300 bg-neutral-100 transition-all",
                        isEditing
                          ? "cursor-pointer hover:border-blue-400 hover:bg-neutral-200"
                          : ""
                      )}
                    >
                      {formData.posterUrl ? (
                        <img
                          src={formData.posterUrl}
                          alt="Poster"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="rounded-full bg-white p-2 shadow-sm">
                            <UploadCloud className="h-5 w-5 text-neutral-500" />
                          </div>
                          {isEditing && (
                            <span className="font-montserrat text-xs text-neutral-500">
                              Klik untuk unggah
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <span className="font-poppins text-xs text-neutral-400">
                        Format: JPG, PNG (Max 5MB)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Kategori Jenjang Lomba */}
            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-poppins text-lg font-medium text-slate-900">
                  Kategori Jenjang Lomba
                </h3>
                {isEditing && (
                  <Button
                    onClick={handleAddCategory}
                    variant="outline"
                    className="rounded-full border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Tambah Jenjang
                  </Button>
                )}
              </div>
              <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="overflow-x-auto">
                  <Table className="min-w-max">
                    <TableHeader className="bg-blue-100">
                      <TableRow className="border-sky-100 hover:bg-transparent">
                        <TableHead className="w-12 text-center font-poppins text-sm font-normal text-neutral-700">
                          No
                        </TableHead>
                        <TableHead className="font-poppins text-sm font-normal text-neutral-700">
                          Nama Jenjang
                        </TableHead>
                        <TableHead className="text-center font-poppins text-sm font-normal text-neutral-700">
                          Kuota Total
                        </TableHead>
                        <TableHead className="text-center font-poppins text-sm font-normal text-neutral-700">
                          Terdaftar
                        </TableHead>
                        <TableHead className="text-center font-poppins text-sm font-normal text-neutral-700">
                          Tersisa
                        </TableHead>
                        <TableHead className="text-center font-poppins text-sm font-normal text-neutral-700">
                          Biaya Pendaftaran
                        </TableHead>
                        <TableHead className="text-center font-poppins text-sm font-normal text-neutral-700">
                          Down Payment (DP)
                        </TableHead>
                        {isEditing && (
                          <TableHead className="text-center font-poppins text-sm font-normal text-neutral-700">
                            Aksi
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.categories.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={isEditing ? 8 : 7}
                            className="py-6 text-center font-poppins text-sm text-neutral-500"
                          >
                            Belum ada kategori lomba.
                          </TableCell>
                        </TableRow>
                      ) : (
                        formData.categories.map((cat, index) => (
                          <TableRow
                            key={cat.id}
                            className="border-sky-100 bg-transparent hover:bg-white/50"
                          >
                            <TableCell className="text-center font-poppins text-sm text-neutral-700">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-poppins text-sm text-neutral-700">
                              {isEditing ? (
                                <Input
                                  className="bg-white focus-visible:ring-sky-200"
                                  value={cat.name}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      cat.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                cat.name
                              )}
                            </TableCell>
                            <TableCell className="text-center font-poppins text-sm text-neutral-700">
                              {isEditing ? (
                                <Input
                                  className="w-24 bg-white text-center focus-visible:ring-sky-200"
                                  type="number"
                                  value={cat.totalQuota}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      cat.id,
                                      "totalQuota",
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                cat.totalQuota
                              )}
                            </TableCell>
                            <TableCell className="text-center font-poppins text-sm font-semibold text-green-500">
                              {cat.registered}
                            </TableCell>
                            <TableCell className="text-center font-poppins text-sm font-semibold text-yellow-500">
                              {cat.remaining}
                            </TableCell>
                            <TableCell className="text-center font-poppins text-sm text-neutral-700">
                              {isEditing ? (
                                <Input
                                  className="w-36 bg-white text-center focus-visible:ring-sky-200"
                                  type="number"
                                  value={cat.registrationFee}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      cat.id,
                                      "registrationFee",
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                formatRupiah(cat.registrationFee)
                              )}
                            </TableCell>
                            <TableCell className="text-center font-poppins text-sm text-neutral-700">
                              {isEditing ? (
                                <Input
                                  className="w-36 bg-white text-center focus-visible:ring-sky-200"
                                  type="number"
                                  value={cat.downPayment}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      cat.id,
                                      "downPayment",
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                formatRupiah(cat.downPayment)
                              )}
                            </TableCell>
                            {isEditing && (
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveCategory(cat.id)}
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
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
