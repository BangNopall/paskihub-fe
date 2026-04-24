"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ==========================================
// 1. REUSABLE UI COMPONENTS (Agar Clean Code)
// ==========================================

function FormGroup({
  label,
  required = true,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-sm font-normal text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  )
}

function FileUploadInput({
  placeholder,
  accept,
  value,
  onChange,
}: {
  placeholder: string
  accept?: string
  value: string
  onChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0])
    }
  }

  return (
    <div className="flex w-full items-center gap-2">
      {/* Hidden Native File Input */}
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
      />

      {/* Custom Trigger Input */}
      <Input
        placeholder={placeholder}
        value={value}
        className="flex-1 cursor-pointer truncate"
        readOnly
        onClick={() => inputRef.current?.click()}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0 border-neutral-200"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 text-neutral-500" />
      </Button>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
      {children}
    </h2>
  )
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/50 bg-gradient-to-b from-white/80 to-white/40 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm md:p-6">
      {children}
    </div>
  )
}

function SubSectionHeader({
  title,
  buttonText,
  onAdd,
}: {
  title: string
  buttonText: string
  onAdd: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-base font-medium text-neutral-700">
        {title} <span className="text-red-500">*</span>
      </h3>
      <Button
        type="button"
        onClick={onAdd}
        variant="secondary"
        className="h-9 rounded-full px-3 md:h-10 md:px-4"
      >
        <Plus className="h-4 w-4 md:mr-1.5" />
        <span className="hidden text-sm font-semibold sm:inline">
          {buttonText}
        </span>
        <span className="inline text-sm font-semibold sm:hidden">Tambah</span>
      </Button>
    </div>
  )
}

function SubSectionCard({
  title,
  onRemove,
  children,
}: {
  title: string
  onRemove?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col gap-4 rounded-xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/40 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-400">{title}</span>
        {/* Tombol Hapus Anggota */}
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden text-xs sm:inline">Hapus</span>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

// ==========================================
// 2. MAIN PAGE & FORM STATE LOGIC
// ==========================================

// Tipe Data untuk Form List
type Anggota = {
  id: string
  namaLengkap: string
  berkas: File | null // Untuk Kartu Pelajar atau Surat Rekomendasi Pelatih
  berkasName: string
  foto: File | null
  fotoUrl: string
}

export default function NewTeamPage() {
  // --- STATE UNTUK INFO TIM ---
  const [namaTim, setNamaTim] = useState("")
  const [logoTim, setLogoTim] = useState<File | null>(null)
  const [logoTimUrl, setLogoTimUrl] = useState("")
  const [suratRekTim, setSuratRekTim] = useState<File | null>(null)

  // --- STATE UNTUK LIST ANGGOTA ---
  const createEmptyAnggota = (): Anggota => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    namaLengkap: "",
    berkas: null,
    berkasName: "",
    foto: null,
    fotoUrl: "",
  })

  const [pelatihList, setPelatihList] = useState<Anggota[]>([
    createEmptyAnggota(),
  ])
  const [danpasList, setDanpasList] = useState<Anggota[]>([
    createEmptyAnggota(),
  ])
  const [officialList, setOfficialList] = useState<Anggota[]>([
    createEmptyAnggota(),
  ])
  const [pasukanList, setPasukanList] = useState<Anggota[]>([
    createEmptyAnggota(),
    createEmptyAnggota(),
  ]) // Default 2 Pasukan

  // --- FUNGSI HELPER UNTUK MENGELOLA LIST (Tambah, Ubah, Hapus) ---
  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<Anggota[]>>
  ) => {
    setter((prev) => [...prev, createEmptyAnggota()])
  }

  const handleRemove = (
    setter: React.Dispatch<React.SetStateAction<Anggota[]>>,
    id: string
  ) => {
    setter((prev) => prev.filter((item) => item.id !== id))
  }

  const handleChangeList = (
    setter: React.Dispatch<React.SetStateAction<Anggota[]>>,
    id: string,
    field: keyof Anggota | "fileBerkas" | "fileFoto",
    value: any
  ) => {
    setter((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "fileFoto") {
            return {
              ...item,
              foto: value,
              fotoUrl: value ? URL.createObjectURL(value) : "",
            }
          }
          if (field === "fileBerkas") {
            return {
              ...item,
              berkas: value,
              berkasName: value ? value.name : "",
            }
          }
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  // --- FUNGSI SUBMIT FORM ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Kumpulkan semua state ke dalam satu Payload (Siap untuk API)
    const payload = {
      informasiTim: {
        namaTim,
        logoTim,
        suratRekomendasiTim: suratRekTim,
      },
      pelatih: pelatihList,
      danpas: danpasList,
      official: officialList,
      pasukan: pasukanList,
    }

    console.log("=== PAYLOAD SUBMIT ===", payload)
    alert(
      "Berhasil mengumpulkan Form! Buka Inspect -> Console Browser untuk melihat format Payload datanya."
    )
    // TODO: Implementasi fetch API post ke backend disini
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* Header Navigasi & Action */}
        <div className="flex flex-col gap-6">
          <Link
            href="/peserta/dashboard/team"
            className="flex w-fit items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-base font-semibold md:text-lg">Kembali</span>
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Buat Tim Baru
            </h1>
            <Button
              type="submit"
              variant={'secondary'}
              className="h-12 w-full rounded-full px-8 text-base font-bold sm:w-auto"
            >
              Buat Tim
            </Button>
          </div>
        </div>

        {/* 1. SECTION: INFORMASI TIM & PELATIH */}
        <div className="flex flex-col gap-4">
          <SectionTitle>Informasi Tim & Pelatih</SectionTitle>
          <GlassCard>
            <div className="flex flex-col gap-5 border-b border-neutral-200/50 pb-6">
              <FormGroup label="Nama Tim">
                <Input
                  required
                  value={namaTim}
                  onChange={(e) => setNamaTim(e.target.value)}
                  placeholder="Contoh: Paskibra Elang Jaya"
                />
              </FormGroup>

              <FormGroup label="Logo Tim">
                <FileUploadInput
                  placeholder="Upload file gambar..."
                  accept="image/*"
                  value={logoTim ? logoTim.name : ""}
                  onChange={(file) => {
                    setLogoTim(file)
                    setLogoTimUrl(file ? URL.createObjectURL(file) : "")
                  }}
                />
                <div className="mt-1 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-stone-200">
                  {logoTimUrl ? (
                    <img
                      src={logoTimUrl}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-neutral-400" />
                  )}
                </div>
              </FormGroup>

              <FormGroup label="Surat Rekomendasi (Tim)">
                <FileUploadInput
                  placeholder="Upload surat rekomendasi .pdf"
                  accept=".pdf"
                  value={suratRekTim ? suratRekTim.name : ""}
                  onChange={(file) => setSuratRekTim(file)}
                />
              </FormGroup>
            </div>

            {/* Sub-Section: Data Pelatih */}
            <div className="flex flex-col gap-4 pt-2">
              <SubSectionHeader
                title="Data Pelatih"
                buttonText="Tambah Pelatih"
                onAdd={() => handleAdd(setPelatihList)}
              />
              {pelatihList.map((pelatih, index) => (
                <SubSectionCard
                  key={pelatih.id}
                  title={`Pelatih #${index + 1}`}
                  onRemove={
                    pelatihList.length > 1
                      ? () => handleRemove(setPelatihList, pelatih.id)
                      : undefined
                  }
                >
                  <FormGroup label="Nama Lengkap">
                    <Input
                      required
                      value={pelatih.namaLengkap}
                      onChange={(e) =>
                        handleChangeList(
                          setPelatihList,
                          pelatih.id,
                          "namaLengkap",
                          e.target.value
                        )
                      }
                      placeholder="Pak Budi Santoso"
                    />
                  </FormGroup>
                  <FormGroup label="Surat Rekomendasi">
                    <FileUploadInput
                      accept=".pdf"
                      placeholder="Upload file .pdf"
                      value={pelatih.berkasName}
                      onChange={(file) =>
                        handleChangeList(
                          setPelatihList,
                          pelatih.id,
                          "fileBerkas",
                          file
                        )
                      }
                    />
                  </FormGroup>
                  <FormGroup label="Foto">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload foto..."
                      value={pelatih.foto ? pelatih.foto.name : ""}
                      onChange={(file) =>
                        handleChangeList(
                          setPelatihList,
                          pelatih.id,
                          "fileFoto",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-stone-200 md:h-20 md:w-20">
                      {pelatih.fotoUrl ? (
                        <img
                          src={pelatih.fotoUrl}
                          alt="Foto"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                  </FormGroup>
                </SubSectionCard>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 2. SECTION: DANPAS & OFFICIAL */}
        <div className="flex flex-col gap-4">
          <SectionTitle>Danpas & Official</SectionTitle>
          <GlassCard>
            {/* List Danpas */}
            <div className="flex flex-col gap-4 border-b border-neutral-200/50 pb-6">
              <SubSectionHeader
                title="List Danpas"
                buttonText="Tambah Danpas"
                onAdd={() => handleAdd(setDanpasList)}
              />
              {danpasList.map((danpas, index) => (
                <SubSectionCard
                  key={danpas.id}
                  title={`Danpas #${index + 1}`}
                  onRemove={
                    danpasList.length > 1
                      ? () => handleRemove(setDanpasList, danpas.id)
                      : undefined
                  }
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <FormGroup label="Nama Lengkap">
                      <Input
                        required
                        value={danpas.namaLengkap}
                        onChange={(e) =>
                          handleChangeList(
                            setDanpasList,
                            danpas.id,
                            "namaLengkap",
                            e.target.value
                          )
                        }
                        placeholder="Siti Nurhaliza Putri"
                      />
                    </FormGroup>
                    <FormGroup label="Kartu Pelajar">
                      <FileUploadInput
                        accept="image/*,.pdf"
                        placeholder="Upload Kartu Pelajar..."
                        value={danpas.berkasName}
                        onChange={(file) =>
                          handleChangeList(
                            setDanpasList,
                            danpas.id,
                            "fileBerkas",
                            file
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <FormGroup label="Foto">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload Foto..."
                      value={danpas.foto ? danpas.foto.name : ""}
                      onChange={(file) =>
                        handleChangeList(
                          setDanpasList,
                          danpas.id,
                          "fileFoto",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-stone-200 md:h-20 md:w-20">
                      {danpas.fotoUrl ? (
                        <img
                          src={danpas.fotoUrl}
                          alt="Foto"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                  </FormGroup>
                </SubSectionCard>
              ))}
            </div>

            {/* List Official */}
            <div className="flex flex-col gap-4 pt-2">
              <SubSectionHeader
                title="Data Official"
                buttonText="Tambah Official"
                onAdd={() => handleAdd(setOfficialList)}
              />
              {officialList.map((official, index) => (
                <SubSectionCard
                  key={official.id}
                  title={`Official #${index + 1}`}
                  onRemove={
                    officialList.length > 1
                      ? () => handleRemove(setOfficialList, official.id)
                      : undefined
                  }
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <FormGroup label="Nama Lengkap">
                      <Input
                        required
                        value={official.namaLengkap}
                        onChange={(e) =>
                          handleChangeList(
                            setOfficialList,
                            official.id,
                            "namaLengkap",
                            e.target.value
                          )
                        }
                        placeholder="Rudi Hartono"
                      />
                    </FormGroup>
                    <FormGroup label="Kartu Pelajar">
                      <FileUploadInput
                        accept="image/*,.pdf"
                        placeholder="Upload Kartu Pelajar..."
                        value={official.berkasName}
                        onChange={(file) =>
                          handleChangeList(
                            setOfficialList,
                            official.id,
                            "fileBerkas",
                            file
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <FormGroup label="Foto">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload Foto..."
                      value={official.foto ? official.foto.name : ""}
                      onChange={(file) =>
                        handleChangeList(
                          setOfficialList,
                          official.id,
                          "fileFoto",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-stone-200 md:h-20 md:w-20">
                      {official.fotoUrl ? (
                        <img
                          src={official.fotoUrl}
                          alt="Foto"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                  </FormGroup>
                </SubSectionCard>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 3. SECTION: PASUKAN */}
        <div className="flex flex-col gap-4">
          <SectionTitle>Pasukan</SectionTitle>
          <GlassCard>
            <div className="flex flex-col gap-4">
              <SubSectionHeader
                title="List Pasukan"
                buttonText="Tambah Pasukan"
                onAdd={() => handleAdd(setPasukanList)}
              />

              {pasukanList.map((pasukan, index) => (
                <SubSectionCard
                  key={pasukan.id}
                  title={`Pasukan #${index + 1}`}
                  onRemove={
                    pasukanList.length > 1
                      ? () => handleRemove(setPasukanList, pasukan.id)
                      : undefined
                  }
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <FormGroup label="Nama Lengkap">
                      <Input
                        required
                        value={pasukan.namaLengkap}
                        onChange={(e) =>
                          handleChangeList(
                            setPasukanList,
                            pasukan.id,
                            "namaLengkap",
                            e.target.value
                          )
                        }
                        placeholder="Nama Pasukan..."
                      />
                    </FormGroup>
                    <FormGroup label="Kartu Pelajar">
                      <FileUploadInput
                        accept="image/*,.pdf"
                        placeholder="Upload Kartu Pelajar..."
                        value={pasukan.berkasName}
                        onChange={(file) =>
                          handleChangeList(
                            setPasukanList,
                            pasukan.id,
                            "fileBerkas",
                            file
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <FormGroup label="Foto">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload Foto..."
                      value={pasukan.foto ? pasukan.foto.name : ""}
                      onChange={(file) =>
                        handleChangeList(
                          setPasukanList,
                          pasukan.id,
                          "fileFoto",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-stone-200 md:h-20 md:w-20">
                      {pasukan.fotoUrl ? (
                        <img
                          src={pasukan.fotoUrl}
                          alt="Foto"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                  </FormGroup>
                </SubSectionCard>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </form>
  )
}
