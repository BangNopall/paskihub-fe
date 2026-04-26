"use client"

import React, { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Save,
} from "lucide-react"

// --- SHADCN UI COMPONENTS ---
// Asumsi path ini sesuai dengan struktur repository standar Shadcn Anda
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export interface TeamMember {
  id: string
  namaLengkap: string
  berkasUrl: string
  berkasFile: File | null
  fotoUrl: string
  fotoFile: File | null
}

export interface TeamInformation {
  namaTim: string
  logoTimUrl: string
  logoTimFile: File | null
  suratRekomendasiUrl: string
  suratRekomendasiFile: File | null
}

export interface TeamPayload {
  informasiTim: TeamInformation
  pelatih: TeamMember[]
  danpas: TeamMember[]
  official: TeamMember[]
  pasukan: TeamMember[]
}

// ==========================================
// 2. REUSABLE UI COMPONENTS (Clean Code)
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
      <Label className="font-poppins text-sm font-normal text-neutral-700">
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
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
      />
      <div
        className="flex h-10 w-full flex-1 cursor-pointer items-center overflow-hidden rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-500 transition-colors hover:bg-neutral-50 md:h-12"
        onClick={() => inputRef.current?.click()}
      >
        <span className="truncate font-poppins">{value || placeholder}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-10 w-10 shrink-0 border-neutral-200 bg-white p-0 md:h-12 md:w-12"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 text-neutral-500 md:h-5 md:w-5" />
      </Button>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-montserrat text-lg font-semibold text-slate-900 md:text-xl">
      {children}
    </h2>
  )
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-white/50 bg-linear-to-b from-white/80 to-white/40 p-4 shadow-sm backdrop-blur-md md:p-6">
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
      <h3 className="font-poppins text-base font-medium text-neutral-700">
        {title} <span className="text-red-500">*</span>
      </h3>
      <Button
        type="button"
        onClick={onAdd}
        variant="secondary"
        className="h-9 rounded-full px-3 md:h-10 md:px-4"
      >
        <Plus className="h-4 w-4 md:mr-1.5" />
        <span className="hidden font-poppins text-sm font-semibold sm:inline">
          {buttonText}
        </span>
        <span className="inline font-poppins text-sm font-semibold sm:hidden">
          Tambah
        </span>
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
    <div className="flex flex-col gap-4 rounded-[10px] border border-sky-100 bg-linear-to-b from-white/70 to-white/40 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span className="font-poppins text-sm font-medium text-neutral-400">
          {title}
        </span>
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

// --- SKELETON LOADER UNTUK UI FEEDBACK ---
function EditTeamSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-24 rounded-md" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-48 rounded-md" />
        <Skeleton className="h-12 w-full rounded-full sm:w-48" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-75 w-full rounded-3xl" />
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function EditTeamPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params?.id as string

  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [informasiTim, setInformasiTim] = useState<TeamInformation>({
    namaTim: "",
    logoTimUrl: "",
    logoTimFile: null,
    suratRekomendasiUrl: "",
    suratRekomendasiFile: null,
  })

  const [pelatihList, setPelatihList] = useState<TeamMember[]>([])
  const [danpasList, setDanpasList] = useState<TeamMember[]>([])
  const [officialList, setOfficialList] = useState<TeamMember[]>([])
  const [pasukanList, setPasukanList] = useState<TeamMember[]>([])

  // --- HELPER FUNCTION: CREATE EMPTY MEMBER ---
  const createEmptyMember = (): TeamMember => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    namaLengkap: "",
    berkasUrl: "",
    berkasFile: null,
    fotoUrl: "",
    fotoFile: null,
  })

  // --- FETCH DATA SIMULATION (API GET) ---
  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true)
      try {
        // TODO: Integrasi endpoint API GET /api/teams/${teamId} di sini
        // Simulasi network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // MOCK DATA RESPONSE
        setInformasiTim({
          namaTim: "Paskibra Elang Jaya",
          logoTimUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=elangjaya",
          logoTimFile: null,
          suratRekomendasiUrl: "surat-rekomendasi-elang-jaya.pdf",
          suratRekomendasiFile: null,
        })

        setPelatihList([
          {
            id: "pelatih-1",
            namaLengkap: "Pak Budi Santoso",
            berkasUrl: "surat-rekomendasi-elang-jaya.pdf",
            berkasFile: null,
            fotoUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=budi",
            fotoFile: null,
          },
        ])

        setDanpasList([
          {
            id: "danpas-1",
            namaLengkap: "Siti Nurhaliza Putri",
            berkasUrl: "kartu-siti.jpg",
            berkasFile: null,
            fotoUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=siti",
            fotoFile: null,
          },
        ])

        setOfficialList([
          {
            id: "official-1",
            namaLengkap: "Rudi Hartono",
            berkasUrl: "kartu-rudi.jpg",
            berkasFile: null,
            fotoUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=rudi",
            fotoFile: null,
          },
        ])

        setPasukanList([
          {
            id: "pasukan-1",
            namaLengkap: "Ahmad Fauzi Rahmat",
            berkasUrl: "kartu-ahmad.jpg",
            berkasFile: null,
            fotoUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=ahmad",
            fotoFile: null,
          },
          {
            id: "pasukan-2",
            namaLengkap: "Budi Santoso",
            berkasUrl: "kartu-budi.jpg",
            berkasFile: null,
            fotoUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=budi2",
            fotoFile: null,
          },
        ])
      } catch (error) {
        console.error("Failed to fetch team data:", error)
        // Handle error UI if needed
      } finally {
        setIsLoading(false)
      }
    }

    if (teamId) fetchTeamData()
  }, [teamId])

  // --- EVENT HANDLERS ---
  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<TeamMember[]>>
  ) => {
    setter((prev) => [...prev, createEmptyMember()])
  }

  const handleRemove = (
    setter: React.Dispatch<React.SetStateAction<TeamMember[]>>,
    id: string
  ) => {
    setter((prev) => prev.filter((item) => item.id !== id))
  }

  const handleMemberChange = (
    setter: React.Dispatch<React.SetStateAction<TeamMember[]>>,
    id: string,
    field: keyof TeamMember,
    value: any
  ) => {
    setter((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "fotoFile") {
            return {
              ...item,
              fotoFile: value,
              fotoUrl: value ? URL.createObjectURL(value) : item.fotoUrl,
            }
          }
          if (field === "berkasFile") {
            return {
              ...item,
              berkasFile: value,
              berkasUrl: value ? value.name : item.berkasUrl,
            }
          }
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload: TeamPayload = {
      informasiTim,
      pelatih: pelatihList,
      danpas: danpasList,
      official: officialList,
      pasukan: pasukanList,
    }

    try {
      // TODO: Integrasi endpoint API PUT/PATCH /api/teams/${teamId} di sini
      console.log("=== PUT PAYLOAD SUBMIT ===", payload)

      // Simulasi delay request
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Perubahan berhasil disimpan! (Cek Console untuk Payload)")
      router.push("/peserta/dashboard/team")
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error)
      alert("Terjadi kesalahan saat menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- CONDITIONAL RENDERING FOR LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
          <EditTeamSkeleton />
        </div>
      </div>
    )
  }

  // --- MAIN RENDER ---
  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-6">
          <Link
            href="/peserta/dashboard/team"
            className="flex w-fit items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-montserrat text-base font-semibold md:text-lg">
              Kembali
            </span>
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-[32px] md:leading-9">
              Edit Tim
            </h1>
            <Button
              type="submit"
              variant={'secondary'}
              disabled={isSubmitting}
              className="h-12 w-full rounded-full px-8 text-base font-bold sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* SECTION 1: INFORMASI TIM & PELATIH */}
        <div className="flex flex-col gap-4">
          <SectionTitle>Informasi Tim & Pelatih</SectionTitle>
          <GlassCard>
            <div className="flex flex-col gap-6 border-b border-neutral-200/50 pb-8">
              <FormGroup label="Nama Tim">
                <Input
                  required
                  value={informasiTim.namaTim}
                  onChange={(e) =>
                    setInformasiTim({
                      ...informasiTim,
                      namaTim: e.target.value,
                    })
                  }
                  placeholder="Contoh: Paskibra Elang Jaya"
                  className="h-10 bg-white font-poppins text-neutral-500 md:h-12"
                />
              </FormGroup>

              <FormGroup label="Logo Tim (URL)">
                <FileUploadInput
                  placeholder="Upload logo tim..."
                  accept="image/*"
                  value={
                    informasiTim.logoTimFile?.name || informasiTim.logoTimUrl
                  }
                  onChange={(file) =>
                    setInformasiTim({
                      ...informasiTim,
                      logoTimFile: file,
                      logoTimUrl: file
                        ? URL.createObjectURL(file)
                        : informasiTim.logoTimUrl,
                    })
                  }
                />
                <div className="mt-1 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-stone-300">
                  {informasiTim.logoTimUrl ? (
                    <img
                      src={informasiTim.logoTimUrl}
                      alt="Logo Tim"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-neutral-400" />
                  )}
                </div>
              </FormGroup>

              <FormGroup label="Surat Rekomendasi">
                <FileUploadInput
                  placeholder="Upload surat rekomendasi (.pdf)"
                  accept=".pdf"
                  value={
                    informasiTim.suratRekomendasiFile?.name ||
                    informasiTim.suratRekomendasiUrl
                  }
                  onChange={(file) =>
                    setInformasiTim({
                      ...informasiTim,
                      suratRekomendasiFile: file,
                    })
                  }
                />
              </FormGroup>
            </div>

            {/* DATA PELATIH */}
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
                        handleMemberChange(
                          setPelatihList,
                          pelatih.id,
                          "namaLengkap",
                          e.target.value
                        )
                      }
                      placeholder="Nama Pelatih"
                      className="h-10 bg-white font-poppins text-neutral-500 md:h-12"
                    />
                  </FormGroup>
                  <FormGroup label="Surat Rekomendasi">
                    <FileUploadInput
                      accept=".pdf"
                      placeholder="Upload file .pdf"
                      value={pelatih.berkasFile?.name || pelatih.berkasUrl}
                      onChange={(file) =>
                        handleMemberChange(
                          setPelatihList,
                          pelatih.id,
                          "berkasFile",
                          file
                        )
                      }
                    />
                  </FormGroup>
                  <FormGroup label="Foto (URL)">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload foto..."
                      value={pelatih.fotoFile?.name || pelatih.fotoUrl}
                      onChange={(file) =>
                        handleMemberChange(
                          setPelatihList,
                          pelatih.id,
                          "fotoFile",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-black/10 bg-stone-300 md:h-20 md:w-20">
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

        {/* SECTION 2: DANPAS & OFFICIAL */}
        <div className="flex flex-col gap-4">
          <SectionTitle>Danpas & Official</SectionTitle>
          <GlassCard>
            {/* LIST DANPAS */}
            <div className="flex flex-col gap-4 border-b border-neutral-200/50 pb-8">
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
                          handleMemberChange(
                            setDanpasList,
                            danpas.id,
                            "namaLengkap",
                            e.target.value
                          )
                        }
                        placeholder="Nama Danpas"
                        className="h-10 bg-white font-poppins text-neutral-500 md:h-12"
                      />
                    </FormGroup>
                    <FormGroup label="Kartu Pelajar">
                      <FileUploadInput
                        accept="image/*,.pdf"
                        placeholder="Upload Kartu Pelajar..."
                        value={danpas.berkasFile?.name || danpas.berkasUrl}
                        onChange={(file) =>
                          handleMemberChange(
                            setDanpasList,
                            danpas.id,
                            "berkasFile",
                            file
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <FormGroup label="Foto (URL)">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload Foto..."
                      value={danpas.fotoFile?.name || danpas.fotoUrl}
                      onChange={(file) =>
                        handleMemberChange(
                          setDanpasList,
                          danpas.id,
                          "fotoFile",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-black/10 bg-stone-300 md:h-20 md:w-20">
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

            {/* DATA OFFICIAL */}
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
                          handleMemberChange(
                            setOfficialList,
                            official.id,
                            "namaLengkap",
                            e.target.value
                          )
                        }
                        placeholder="Nama Official"
                        className="h-10 bg-white font-poppins text-neutral-500 md:h-12"
                      />
                    </FormGroup>
                    <FormGroup label="Kartu Pelajar">
                      <FileUploadInput
                        accept="image/*,.pdf"
                        placeholder="Upload Kartu Pelajar..."
                        value={official.berkasFile?.name || official.berkasUrl}
                        onChange={(file) =>
                          handleMemberChange(
                            setOfficialList,
                            official.id,
                            "berkasFile",
                            file
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <FormGroup label="Foto (URL)">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload Foto..."
                      value={official.fotoFile?.name || official.fotoUrl}
                      onChange={(file) =>
                        handleMemberChange(
                          setOfficialList,
                          official.id,
                          "fotoFile",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-black/10 bg-stone-300 md:h-20 md:w-20">
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

        {/* SECTION 3: PASUKAN */}
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
                          handleMemberChange(
                            setPasukanList,
                            pasukan.id,
                            "namaLengkap",
                            e.target.value
                          )
                        }
                        placeholder="Nama Pasukan"
                        className="h-10 bg-white font-poppins text-neutral-500 md:h-12"
                      />
                    </FormGroup>
                    <FormGroup label="Kartu Pelajar">
                      <FileUploadInput
                        accept="image/*,.pdf"
                        placeholder="Upload Kartu Pelajar..."
                        value={pasukan.berkasFile?.name || pasukan.berkasUrl}
                        onChange={(file) =>
                          handleMemberChange(
                            setPasukanList,
                            pasukan.id,
                            "berkasFile",
                            file
                          )
                        }
                      />
                    </FormGroup>
                  </div>
                  <FormGroup label="Foto (URL)">
                    <FileUploadInput
                      accept="image/*"
                      placeholder="Upload Foto..."
                      value={pasukan.fotoFile?.name || pasukan.fotoUrl}
                      onChange={(file) =>
                        handleMemberChange(
                          setPasukanList,
                          pasukan.id,
                          "fotoFile",
                          file
                        )
                      }
                    />
                    <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-black/10 bg-stone-300 md:h-20 md:w-20">
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
