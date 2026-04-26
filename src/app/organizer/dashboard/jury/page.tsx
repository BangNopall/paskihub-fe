"use client"

import React, { useState, useEffect } from "react"
import { Pencil, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export interface Jury {
  id: string
  name: string
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_JURIES: Jury[] = [
  { id: "juri-1", name: "Budi Santoso, S.Pd" },
  { id: "juri-2", name: "Siti Nurhaliza, M.Pd" },
  { id: "juri-3", name: "Ahmad Fauzi, S.Or" },
]

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function OrganizerJuryPage() {
  // --- STATE MANAGEMENT ---
  const [juries, setJuries] = useState<Jury[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // --- MODAL & FORM STATES ---
  // Modal Controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Active Data for Modals
  const [selectedJury, setSelectedJury] = useState<Jury | null>(null)
  const [juryFormName, setJuryFormName] = useState<string>("")

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchJuries = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/juries di sini
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulasi network delay

        setJuries(MOCK_JURIES)
      } catch (error) {
        console.error("Gagal memuat data juri:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJuries()
  }, [])

  // --- HANDLERS: MODAL TRIGGERS ---
  const handleOpenAddModal = () => {
    setJuryFormName("")
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (jury: Jury) => {
    setSelectedJury(jury)
    setJuryFormName(jury.name)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (jury: Jury) => {
    setSelectedJury(jury)
    setIsDeleteModalOpen(true)
  }

  // --- HANDLERS: CRUD SUBMISSIONS ---
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!juryFormName.trim()) return

    setIsSubmitting(true)
    try {
      // TODO: Integrasi API POST /api/organizer/juries
      const newJury: Jury = {
        id: `juri-${Date.now()}`,
        name: juryFormName,
      }

      await new Promise((res) => setTimeout(res, 1000)) // Simulasi API

      setJuries((prev) => [...prev, newJury])
      setIsAddModalOpen(false)
      setJuryFormName("")
    } catch (error) {
      alert("Gagal menambah juri.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJury || !juryFormName.trim()) return

    setIsSubmitting(true)
    try {
      // TODO: Integrasi API PUT/PATCH /api/organizer/juries/{id}
      await new Promise((res) => setTimeout(res, 1000)) // Simulasi API

      setJuries((prev) =>
        prev.map((j) =>
          j.id === selectedJury.id ? { ...j, name: juryFormName } : j
        )
      )
      setIsEditModalOpen(false)
      setSelectedJury(null)
    } catch (error) {
      alert("Gagal memperbarui juri.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJury) return

    setIsSubmitting(true)
    try {
      // TODO: Integrasi API DELETE /api/organizer/juries/{id}
      await new Promise((res) => setTimeout(res, 1000)) // Simulasi API

      setJuries((prev) => prev.filter((j) => j.id !== selectedJury.id))
      setIsDeleteModalOpen(false)
      setSelectedJury(null)
    } catch (error) {
      alert("Gagal menghapus juri.")
    } finally {
      setIsSubmitting(false)
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
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Data Juri
          </h1>
          <Button
            onClick={handleOpenAddModal}
            variant="outline"
            className="rounded-full border-red-300 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Juri
          </Button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex w-full flex-col gap-4 rounded-3xl border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
          {isLoading ? (
            // LOADING SKELETONS
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            // LIST JURI
            <div className="flex flex-col gap-3 md:gap-4">
              {juries.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12">
                  <p className="font-poppins text-sm text-neutral-500">
                    Belum ada data juri terdaftar.
                  </p>
                </div>
              ) : (
                juries.map((jury) => (
                  <div
                    key={jury.id}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 hover:bg-slate-50/50"
                  >
                    <span className="max-w-[70%] truncate font-poppins text-base font-normal text-zinc-600">
                      {jury.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(jury)}
                        className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${jury.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteModal(jury)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Hapus ${jury.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* =========================================
            MODALS SECTION (Rendered Once, Controlled by State)
            ========================================= */}

        {/* 1. MODAL TAMBAH JURI */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={handleAddSubmit} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  Tambah Juri
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Formulir untuk menambah data juri baru
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-8 p-6 sm:p-10">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="addNamaJuri"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Nama Juri
                  </Label>
                  <Input
                    id="addNamaJuri"
                    value={juryFormName}
                    onChange={(e) => setJuryFormName(e.target.value)}
                    placeholder="Masukkan Nama Juri"
                    className="h-12 bg-white font-poppins text-sm focus-visible:ring-sky-200"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !juryFormName.trim()}
                    className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. MODAL EDIT JURI */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={handleEditSubmit} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  Edit Juri
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Formulir untuk mengedit data juri
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-8 p-6 sm:p-10">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="editNamaJuri"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Nama Juri
                  </Label>
                  <Input
                    id="editNamaJuri"
                    value={juryFormName}
                    onChange={(e) => setJuryFormName(e.target.value)}
                    placeholder="Masukkan Nama Juri"
                    className="h-12 bg-white font-poppins text-sm focus-visible:ring-sky-200"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !juryFormName.trim()}
                    className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. MODAL HAPUS JURI (KONFIRMASI) */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={handleDeleteSubmit} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  Konfirmasi
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Konfirmasi penghapusan data juri
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-8 p-6 sm:p-10">
                <div className="text-center font-poppins text-sm text-neutral-600">
                  Yakin ingin menghapus juri{" "}
                  <span className="font-semibold text-neutral-800">
                    "{selectedJury?.name}"
                  </span>
                  ?
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Yakin"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
