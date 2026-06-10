/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createTeamAction } from "@/actions/team.actions"
import { TeamFormData, TeamFormSchema } from "@/schemas/team.schema"

// ==========================================
// 1. REUSABLE UI COMPONENTS
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
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
      />
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
// 2. FORM STATE LOGIC
// ==========================================

type MemberState = {
  id: string
  fullName: string
  role: string
  idCard: File | null
  photo: File | null
  photoUrl: string
}

const createEmptyMember = (role: string): MemberState => ({
  id: Math.random().toString(36).substring(2, 9),
  fullName: "",
  role: role,
  idCard: null,
  photo: null,
  photoUrl: "",
})

export default function NewTeamPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- STATE UNTUK INFO TIM ---
  const [namaTim, setNamaTim] = useState("")
  const [logoTim, setLogoTim] = useState<File | null>(null)
  const [logoTimUrl, setLogoTimUrl] = useState("")
  const [suratRekTim, setSuratRekTim] = useState<File | null>(null)
  const [pelatihName, setPelatihName] = useState("")

  // --- STATE UNTUK LIST ANGGOTA ---

  const [members, setMembers] = useState<MemberState[]>([
    createEmptyMember("DANPAS"),
    createEmptyMember("OFFICIAL"),
    createEmptyMember("PASUKAN"),
    createEmptyMember("PASUKAN"),
  ])

  const handleAddMember = (role: string) => {
    setMembers((prev) => [...prev, createEmptyMember(role)])
  }

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const handleMemberChange = (
    id: string,
    field: keyof MemberState,
    value: any
  ) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          if (field === "photo") {
            return {
              ...m,
              photo: value,
              photoUrl: value ? URL.createObjectURL(value) : "",
            }
          }
          return { ...m, [field]: value }
        }
        return m
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!namaTim || !pelatihName) {
      toast.error("Nama Tim dan Nama Pelatih wajib diisi")
      return
    }

    setIsSubmitting(true)

    const payload: TeamFormData = {
      namaTim,
      pelatih: pelatihName,
      logoTim: logoTim || undefined,
      suratRekomendasi: suratRekTim || undefined,
      members: members.map((m) => ({
        fullName: m.fullName,
        role: m.role,
        idCard: m.idCard || undefined,
        photo: m.photo || undefined,
      })),
    }

    try {
      const res = await createTeamAction(payload)
      if (res.success) {
        toast.success("Tim berhasil dibuat")
        router.push("/peserta/dashboard/team")
      } else {
        // eslint-disable-next-line no-console
        console.log(res)
        toast.error(res.error || "Gagal membuat tim")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
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
              variant={"secondary"}
              disabled={isSubmitting}
              className="h-12 w-full rounded-full px-8 text-base font-bold sm:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Buat Tim"
              )}
            </Button>
          </div>
        </div>

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

              <FormGroup label="Nama Pelatih Utama">
                <Input
                  required
                  value={pelatihName}
                  onChange={(e) => setPelatihName(e.target.value)}
                  placeholder="Contoh: Pak Budi Santoso"
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
          </GlassCard>
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>Daftar Anggota</SectionTitle>
          <GlassCard>
            {["DANPAS", "OFFICIAL", "PASUKAN"].map((role) => (
              <div
                key={role}
                className="flex flex-col gap-4 border-b border-neutral-200/50 pb-6 last:border-0 last:pb-0"
              >
                <SubSectionHeader
                  title={`List ${role}`}
                  buttonText={`Tambah ${role}`}
                  onAdd={() => handleAddMember(role)}
                />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {members
                    .filter((m) => m.role === role)
                    .map((member, index) => (
                      <SubSectionCard
                        key={member.id}
                        title={`${role} #${index + 1}`}
                        onRemove={
                          members.filter((m) => m.role === role).length > 1
                            ? () => handleRemoveMember(member.id)
                            : undefined
                        }
                      >
                        <FormGroup label="Nama Lengkap">
                          <Input
                            required
                            value={member.fullName}
                            onChange={(e) =>
                              handleMemberChange(
                                member.id,
                                "fullName",
                                e.target.value
                              )
                            }
                            placeholder={`Nama ${role.toLowerCase()}...`}
                          />
                        </FormGroup>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormGroup label="Kartu Pelajar">
                            <FileUploadInput
                              accept="image/*,.pdf"
                              placeholder="Upload Kartu..."
                              value={member.idCard ? member.idCard.name : ""}
                              onChange={(file) =>
                                handleMemberChange(member.id, "idCard", file)
                              }
                            />
                          </FormGroup>
                          <FormGroup label="Foto">
                            <FileUploadInput
                              accept="image/*"
                              placeholder="Upload Foto..."
                              value={member.photo ? member.photo.name : ""}
                              onChange={(file) =>
                                handleMemberChange(member.id, "photo", file)
                              }
                            />
                          </FormGroup>
                        </div>
                        {member.photoUrl && (
                          <div className="mt-1 flex h-16 w-16 overflow-hidden rounded-xl border border-black/10">
                            <img
                              src={member.photoUrl}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </SubSectionCard>
                    ))}
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </form>
  )
}
