"use client"

import { useState } from "react"
import { Pencil, Save, X, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Interface untuk menampung data form
interface EventData {
  namaEvent: string
  penyelenggara: string
  deskripsi: string
  bukaPendaftaran: string
  tutupPendaftaran: string
  pelaksanaanLomba: string
  lokasi: string
  kuotaTim: string
  minAnggota: string
  maxAnggota: string
  waPanitia: string
  penanggungJawab: string
  linkGrupWa: string
  namaBank: string
  atasNama: string
  nomorRekening: string
}

export default function EventPage() {
  const [isEditing, setIsEditing] = useState(false)
  
  // State untuk menyimpan data event
  const [formData, setFormData] = useState<EventData>({
    namaEvent: "Lomba Gerak Jalan Nasional 2025",
    penyelenggara: "SMAN 1 Jakarta",
    deskripsi:
      "Kompetisi gerak jalan tingkat nasional untuk kategori pelajar dan umum. Event ini bertujuan untuk mengembangkan disiplin, kekompakan, dan jiwa patriotisme melalui lomba gerak jalan yang kompetitif dan edukatif.",
    bukaPendaftaran: "1 Juni 2026",
    tutupPendaftaran: "10 Agustus 2026",
    pelaksanaanLomba: "18 Agustus 2026",
    lokasi: "Lapangan Merdeka, Jakarta Pusat",
    kuotaTim: "55",
    minAnggota: "10",
    maxAnggota: "25",
    waPanitia: "+62 812-3456-7890",
    penanggungJawab: "Ahmad Fauzi, S.Pd",
    linkGrupWa: "https://chat.whatsapp.com/contohlinkgrup",
    namaBank: "BCA",
    atasNama: "Panitia Lomba GJ 2025",
    nomorRekening: "1234567890",
  })

  // Handler untuk mengupdate state saat input berubah
  const handleChange =
    (field: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  // Handler saat tombol Simpan ditekan
  const handleSave = () => {
    // TODO: Implementasi logika submit API di sini
    console.log("Data disumbit:", formData)
    setIsEditing(false)
  }

  // Handler saat tombol Batal ditekan (opsional: reset data ke awal jika diperlukan)
  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
          <Card className="bg-glassmorphism-50 border-none shadow-sm @container/card">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-xl font-bold text-dark-blue">
                Info Dasar Event
              </CardTitle>
              <CardAction>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-2 text-neutral-500 hover:text-neutral-700"
                    >
                      <X className="h-4 w-4" />
                      <span>Batal</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Save className="h-4 w-4" />
                      <span>Simpan</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Event</span>
                  </Button>
                )}
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Identitas Event */}
              <InfoSection title="Identitas Event">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <EditableField
                    label="Nama Event"
                    value={formData.namaEvent}
                    isEditing={isEditing}
                    onChange={handleChange("namaEvent")}
                    className="md:col-span-1 lg:col-span-1"
                  />
                  <EditableField
                    label="Penyelenggara"
                    value={formData.penyelenggara}
                    isEditing={isEditing}
                    onChange={handleChange("penyelenggara")}
                  />
                  <EditableField
                    label="Deskripsi Event"
                    value={formData.deskripsi}
                    isEditing={isEditing}
                    onChange={handleChange("deskripsi")}
                    type="textarea"
                    className="md:col-span-2 lg:col-span-3"
                  />
                </div>
              </InfoSection>

              {/* Jadwal dan Lokasi */}
              <InfoSection title="Jadwal dan Lokasi">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <EditableField
                    label="Buka Pendaftaran"
                    value={formData.bukaPendaftaran}
                    isEditing={isEditing}
                    onChange={handleChange("bukaPendaftaran")}
                  />
                  <EditableField
                    label="Tutup Pendaftaran"
                    value={formData.tutupPendaftaran}
                    isEditing={isEditing}
                    onChange={handleChange("tutupPendaftaran")}
                  />
                  <EditableField
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
                    className="sm:col-span-2 lg:col-span-3"
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
                  />
                  <StatCard
                    label="Min. Anggota per Tim"
                    value={formData.minAnggota}
                    isEditing={isEditing}
                    onChange={handleChange("minAnggota")}
                  />
                  <StatCard
                    label="Max. Anggota per Tim"
                    value={formData.maxAnggota}
                    isEditing={isEditing}
                    onChange={handleChange("maxAnggota")}
                  />
                </div>
              </InfoSection>

              {/* Informasi Kontak */}
              <InfoSection title="Informasi Kontak">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <EditableField
                    label="WhatsApp Panitia"
                    value={formData.waPanitia}
                    isEditing={isEditing}
                    onChange={handleChange("waPanitia")}
                  />
                  <EditableField
                    label="Penanggung Jawab"
                    value={formData.penanggungJawab}
                    isEditing={isEditing}
                    onChange={handleChange("penanggungJawab")}
                  />
                  <EditableField
                    label="Link Grup WhatsApp Peserta"
                    value={formData.linkGrupWa}
                    isEditing={isEditing}
                    onChange={handleChange("linkGrupWa")}
                    viewComponent={
                      <a
                        href={formData.linkGrupWa}
                        target="_blank"
                        rel="noreferrer"
                        className="text-info-600 transition-colors hover:underline"
                      >
                        🔗 Buka Grup WhatsApp
                      </a>
                    }
                  />
                </div>
              </InfoSection>

              {/* Pembayaran */}
              <InfoSection title="Pembayaran">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <EditableField
                    label="Nama Bank"
                    value={formData.namaBank}
                    isEditing={isEditing}
                    onChange={handleChange("namaBank")}
                  />
                  <EditableField
                    label="Atas Nama"
                    value={formData.atasNama}
                    isEditing={isEditing}
                    onChange={handleChange("atasNama")}
                  />
                  <EditableField
                    label="Nomor Rekening"
                    value={formData.nomorRekening}
                    isEditing={isEditing}
                    onChange={handleChange("nomorRekening")}
                  />
                </div>
              </InfoSection>

              {/* Assets Media */}
              <InfoSection title="Aset Media Event">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-neutral-500">Logo Event</span>
                    <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 transition-colors hover:bg-neutral-100">
                      <span className="text-xs text-neutral-400">No Logo</span>
                      {isEditing && (
                        <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-neutral-500">Poster Event</span>
                    <div className="group relative flex aspect-4/3 w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 transition-colors hover:bg-neutral-100">
                      <span className="text-xs text-neutral-400">No Poster</span>
                      {isEditing && (
                        <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" /> Unggah Poster Baru
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </InfoSection>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// --- Helper Components ---

function InfoSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      {children}
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
  viewComponent,
}: {
  label: string
  value: string
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: "text" | "textarea" | "number"
  className?: string
  viewComponent?: React.ReactNode // Komponen kustom untuk view mode (misal link)
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      {isEditing ? (
        type === "textarea" ? (
          <Textarea
            value={value}
            onChange={onChange}
            className="min-h-[100px] resize-y"
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={onChange}
          />
        )
      ) : (
        <div className="text-sm font-semibold text-neutral-700">
          {viewComponent || value}
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  isEditing,
  onChange,
}: {
  label: string
  value: string
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md">
      {isEditing ? (
        <Input
          type="number"
          value={value}
          onChange={onChange}
          className="h-10 max-w-[120px] text-center text-lg font-bold"
        />
      ) : (
        <span className="text-2xl font-bold text-neutral-700">{value}</span>
      )}
      <span className="text-center text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
    </div>
  )
}