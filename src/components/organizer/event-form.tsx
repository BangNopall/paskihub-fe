"use client"

import React, { useState, useRef } from "react"
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
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { format, parse } from "date-fns"
import { id } from "date-fns/locale"
import {
  updateEventAction,
  uploadEventLogoAction,
  uploadEventPosterAction,
  createEventLevelAction,
  updateEventLevelAction,
  deleteEventLevelAction,
} from "@/actions/event.actions"

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface EventLevel {
  id: string
  name: string
  regis_fee: string
  dp_fee: string
  registered?: number
  remaining?: number
  total_quota?: number
  isNew?: boolean
}

export interface EventData {
  id: string
  user_id: string
  status: string
  name: string
  organizer: string
  description: string
  open_date: string
  close_date: string
  compe_date: string
  location: string
  min_team_members: number
  max_team_members: number
  no_wa_pj: string
  name_pj: string
  wa_group: string
  bank_name: string
  bank_number: string
  logo_path: any
  poster_path: any
  levels: EventLevel[]
}

interface EventFormProps {
  initialData: EventData
}

// ==========================================
// 2. UI HELPER COMPONENTS
// ==========================================

function formatRupiah(amount: string | number) {
  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    amount === "0"
  )
    return "-"
  const numericAmount = typeof amount === "string" ? parseInt(amount) : amount
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numericAmount || 0)
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
  onTimeChange,
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
  onTimeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: "text" | "textarea" | "number" | "email" | "date" | "datetime"
  className?: string
  placeholder?: string
}) {
  // Handle display for non-editing mode
  const displayValue = (val: any) => {
    if (
      val === undefined ||
      val === null ||
      val === "" ||
      val === 0 ||
      val === "null"
    )
      return "-"
    return val
  }

  if (type === "datetime") {
    const valStr = String(value || "").replace("null", "")
    let datePart = ""
    let timePart = "00:00:00"
    let formattedDisplay = "-"

    if (valStr) {
      try {
        const d = new Date(valStr)
        if (!isNaN(d.getTime())) {
          datePart = format(d, "yyyy-MM-dd")
          timePart = format(d, "HH:mm:ss")
          formattedDisplay = format(d, "dd MMMM yyyy, HH:mm", { locale: id })
        } else {
          const parts = valStr.split(/[ T]/)
          datePart = parts[0] || ""
          timePart = parts[1] ? parts[1].split(/[+Z]/)[0] : "00:00:00"
          formattedDisplay = valStr
        }
      } catch (e) {
        formattedDisplay = valStr
      }
    }

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Label className="font-poppins text-sm font-normal text-neutral-500">
          {label}
        </Label>
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              type="date"
              value={datePart || ""}
              onChange={onChange}
              className="bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
            />
            <Input
              type="time"
              step="1"
              value={timePart || "00:00:00"}
              onChange={onTimeChange}
              className="w-32 bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
            />
          </div>
        ) : (
          <div className="font-poppins text-sm font-semibold text-neutral-700">
            {formattedDisplay}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="font-poppins text-sm font-normal text-neutral-500">
        {label}
      </Label>
      {isEditing ? (
        type === "textarea" ? (
          <Textarea
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="min-h-[100px] resize-y bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
          />
        ) : (
          <Input
            type={type}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
          />
        )
      ) : (
        <div className="font-poppins text-sm font-semibold text-neutral-700">
          {displayValue(value)}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, isEditing, onChange, description }: any) {
  const displayValue = (val: any) => {
    if (val === undefined || val === null || val === "" || val === 0) return "-"
    return val
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
      {isEditing ? (
        <Input
          type="number"
          value={value || 0}
          onChange={onChange}
          className="h-10 w-24 text-center font-poppins text-lg font-bold focus-visible:ring-sky-200"
        />
      ) : (
        <span className="font-poppins text-xl font-semibold text-neutral-700">
          {displayValue(value)}
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
// 3. MAIN FORM COMPONENT
// ==========================================

export default function OrganizerEventForm({ initialData }: EventFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EventData>(initialData)
  const [deletedLevelIds, setDeletedLevelIds] = useState<string[]>([])

  // Track files locally
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(initialData.logo_path)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>(
    initialData.poster_path
  )

  // Referensi untuk file input
  const logoInputRef = useRef<HTMLInputElement>(null)
  const posterInputRef = useRef<HTMLInputElement>(null)

  // --- HANDLERS TEXT & DATES ---
  const handleChange =
    (field: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value })
    }

  const handleDateTimeChange =
    (field: keyof EventData, type: "date" | "time") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawVal = String(formData[field] || "").replace("null", "")
      let datePart = ""
      let timePart = "00:00:00"

      if (rawVal) {
        try {
          const d = new Date(rawVal)
          if (!isNaN(d.getTime())) {
            datePart = format(d, "yyyy-MM-dd")
            timePart = format(d, "HH:mm:ss")
          } else {
            const parts = rawVal.split(/[ T]/)
            datePart = parts[0] || ""
            timePart = parts[1] ? parts[1].split(/[+Z]/)[0] : "00:00:00"
          }
        } catch (e) {}
      }

      if (!datePart) datePart = format(new Date(), "yyyy-MM-dd")

      if (type === "date") {
        datePart = e.target.value
      } else {
        timePart = e.target.value
        if (timePart.split(":").length === 2) timePart += ":00"
      }

      setFormData({ ...formData, [field]: `${datePart}T${timePart}+07:00` })
    }

  const handleLevelChange = (
    id: string,
    field: keyof EventLevel,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      levels: formData.levels.map((level) =>
        level.id === id ? { ...level, [field]: value } : level
      ),
    })
  }

  const handleAddLevel = () => {
    const newLevel: EventLevel = {
      id: `temp-${Date.now()}`,
      name: "Jenjang Baru",
      regis_fee: "0",
      dp_fee: "0",
      isNew: true,
    }
    setFormData({
      ...formData,
      levels: [...formData.levels, newLevel],
    })
  }

  const handleRemoveLevel = (levelId: string) => {
    if (!levelId.startsWith("temp-")) {
      setDeletedLevelIds([...deletedLevelIds, levelId])
    }
    setFormData({
      ...formData,
      levels: formData.levels.filter((l) => l.id !== levelId),
    })
  }

  // --- HANDLERS FILE UPLOAD ---
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran maksimal logo adalah 10MB")
        return
      }
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran maksimal poster adalah 10MB")
        return
      }
      setPosterFile(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  // --- HANDLERS ACTION ---
  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // 1. Update Event Info
      const updateData = {
        id: formData.id,
        name: formData.name,
        organizer: formData.organizer,
        description: formData.description,
        open_date: formData.open_date,
        close_date: formData.close_date,
        compe_date: formData.compe_date,
        location: formData.location,
        min_team_members: Number(formData.min_team_members),
        max_team_members: Number(formData.max_team_members),
        no_wa_pj: formData.no_wa_pj,
        name_pj: formData.name_pj,
        wa_group: formData.wa_group,
        bank_name: formData.bank_name,
        bank_number: formData.bank_number,
        user_id: formData.user_id,
        status: formData.status,
      }

      const res = await updateEventAction(formData.id, updateData)
      if (!res.success) throw new Error(res.message)

      // 2. Upload Logo if changed
      if (logoFile) {
        const logoFormData = new FormData()
        logoFormData.append("logo", logoFile)
        const logoRes = await uploadEventLogoAction(formData.id, logoFormData)
        if (!logoRes.success) toast.error(logoRes.message)
      }

      // 3. Upload Poster if changed
      if (posterFile) {
        const posterFormData = new FormData()
        posterFormData.append("poster", posterFile)
        const posterRes = await uploadEventPosterAction(
          formData.id,
          posterFormData
        )
        if (!posterRes.success) toast.error(posterRes.message)
      }

      // 4. Handle Levels CRUD
      // a. Delete
      for (const id of deletedLevelIds) {
        await deleteEventLevelAction(formData.id, id)
      }
      // b. Update & Create
      for (const level of formData.levels) {
        if (level.isNew) {
          await createEventLevelAction(formData.id, {
            name: level.name,
            regis_fee: String(level.regis_fee),
            dp_fee: String(level.dp_fee),
            event_id: formData.id,
          })
        } else {
          await updateEventLevelAction(formData.id, level.id, {
            name: level.name,
            regis_fee: String(level.regis_fee),
            dp_fee: String(level.dp_fee),
            event_id: formData.id,
          })
        }
      }

      toast.success("Perubahan berhasil disimpan!")
      setIsEditing(false)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.log(error)
      console.error("Gagal menyimpan data:", error)
      toast.error(
        error.message || "Terjadi kesalahan saat menyimpan perubahan."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(initialData)
    setDeletedLevelIds([])
    setLogoPreview(initialData.logo_path)
    setPosterPreview(initialData.poster_path)
    setLogoFile(null)
    setPosterFile(null)
  }

  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-50 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm md:p-6">
      {/* HEADER ACTIONS */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-poppins text-lg font-medium text-slate-900">
          Info Dasar Event
        </h2>
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
      </div>

      {/* Identitas Event */}
      <InfoSection title="Identitas Event">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EditableField
            label="Nama Event"
            value={formData.name}
            isEditing={isEditing}
            onChange={handleChange("name")}
          />
          <EditableField
            label="Penyelenggara"
            value={formData.organizer}
            isEditing={isEditing}
            onChange={handleChange("organizer")}
          />
          <EditableField
            label="Deskripsi Event"
            type="textarea"
            value={formData.description}
            isEditing={isEditing}
            onChange={handleChange("description")}
            className="md:col-span-2 lg:col-span-3"
          />
        </div>
      </InfoSection>

      {/* Jadwal dan Lokasi */}
      <InfoSection title="Jadwal dan Lokasi">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <EditableField
            type="datetime"
            label="Pendaftaran Dibuka"
            value={formData.open_date}
            isEditing={isEditing}
            onChange={handleDateTimeChange("open_date", "date")}
            onTimeChange={handleDateTimeChange("open_date", "time")}
          />
          <EditableField
            type="datetime"
            label="Pendaftaran Ditutup"
            value={formData.close_date}
            isEditing={isEditing}
            onChange={handleDateTimeChange("close_date", "date")}
            onTimeChange={handleDateTimeChange("close_date", "time")}
          />
          <EditableField
            type="datetime"
            label="Pelaksanaan Lomba"
            value={formData.compe_date}
            isEditing={isEditing}
            onChange={handleDateTimeChange("compe_date", "date")}
            onTimeChange={handleDateTimeChange("compe_date", "time")}
          />
          <EditableField
            label="Lokasi"
            value={formData.location}
            isEditing={isEditing}
            onChange={handleChange("location")}
            className="sm:col-span-3"
          />
        </div>
      </InfoSection>

      {/* Ketentuan Peserta */}
      <InfoSection title="Ketentuan Peserta">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Min. Anggota per Tim"
            value={formData.min_team_members}
            isEditing={isEditing}
            onChange={handleChange("min_team_members")}
            description="Minimal anggota per tim"
          />
          <StatCard
            label="Max. Anggota per Tim"
            value={formData.max_team_members}
            isEditing={isEditing}
            onChange={handleChange("max_team_members")}
            description="Maksimal anggota per tim"
          />
        </div>
      </InfoSection>

      {/* Informasi Kontak */}
      <InfoSection title="Informasi Kontak">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EditableField
            label="WhatsApp Panitia"
            value={formData.no_wa_pj}
            isEditing={isEditing}
            onChange={handleChange("no_wa_pj")}
          />
          <EditableField
            label="Grup WhatsApp Peserta"
            value={formData.wa_group}
            isEditing={isEditing}
            onChange={handleChange("wa_group")}
          />
          <EditableField
            label="Penanggung Jawab"
            value={formData.name_pj}
            isEditing={isEditing}
            onChange={handleChange("name_pj")}
            className="md:col-span-2"
          />
        </div>
      </InfoSection>

      {/* Pembayaran */}
      <InfoSection title="Pembayaran">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EditableField
            label="Nama Bank"
            value={formData.bank_name}
            isEditing={isEditing}
            onChange={handleChange("bank_name")}
          />
          <EditableField
            label="Nomor Rekening"
            type="number"
            value={formData.bank_number}
            isEditing={isEditing}
            onChange={handleChange("bank_number")}
          />
          <EditableField
            label="Atas Nama"
            value={formData.name_pj} // Selalu ambil dari name_pj
            isEditing={false}
            onChange={() => {}}
            className="md:col-span-2"
          />
        </div>
      </InfoSection>

      {/* Aset Media Event */}
      <InfoSection title="Aset Media Event">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* UPLOAD LOGO */}
          <div className="flex flex-col gap-2">
            <span className="font-poppins text-sm font-normal text-neutral-500">
              Logo Event
            </span>
            <div className="flex flex-col items-start gap-2">
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
                {logoPreview ? (
                  <img
                    src={logoPreview}
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
            </div>
          </div>

          {/* UPLOAD POSTER */}
          <div className="flex flex-col gap-2">
            <span className="font-poppins text-sm font-normal text-neutral-500">
              Poster Event
            </span>
            <div className="flex flex-col items-start gap-2">
              <input
                type="file"
                className="hidden"
                ref={posterInputRef}
                accept=".jpg,.jpeg,.png"
                onChange={handlePosterChange}
              />
              <div
                onClick={() => isEditing && posterInputRef.current?.click()}
                className={cn(
                  "flex h-32 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300 bg-neutral-100 transition-all",
                  isEditing
                    ? "cursor-pointer hover:border-blue-400 hover:bg-neutral-200"
                    : ""
                )}
              >
                {posterPreview ? (
                  <img
                    src={posterPreview}
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
              onClick={handleAddLevel}
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
                {formData.levels.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isEditing ? 5 : 4}
                      className="py-6 text-center font-poppins text-sm text-neutral-500"
                    >
                      Belum ada kategori lomba.
                    </TableCell>
                  </TableRow>
                ) : (
                  formData.levels.map((level, index) => (
                    <TableRow
                      key={level.id}
                      className="border-sky-100 bg-transparent hover:bg-white/50"
                    >
                      <TableCell className="text-center font-poppins text-sm text-neutral-700">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-poppins text-sm text-neutral-700">
                        {isEditing ? (
                          <Input
                            className="bg-white focus-visible:ring-sky-200"
                            value={level.name || ""}
                            onChange={(e) =>
                              handleLevelChange(
                                level.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          level.name || "-"
                        )}
                      </TableCell>
                      <TableCell className="text-center font-poppins text-sm text-neutral-700">
                        {isEditing ? (
                          <Input
                            className="w-36 bg-white text-center focus-visible:ring-sky-200"
                            type="number"
                            value={level.regis_fee || ""}
                            onChange={(e) =>
                              handleLevelChange(
                                level.id,
                                "regis_fee",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          formatRupiah(level.regis_fee)
                        )}
                      </TableCell>
                      <TableCell className="text-center font-poppins text-sm text-neutral-700">
                        {isEditing ? (
                          <Input
                            className="w-36 bg-white text-center focus-visible:ring-sky-200"
                            type="number"
                            value={level.dp_fee || ""}
                            onChange={(e) =>
                              handleLevelChange(
                                level.id,
                                "dp_fee",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          formatRupiah(level.dp_fee)
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLevel(level.id)}
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
  )
}
