"use client"

import React, { useState, useEffect } from "react"
import { Pencil, Plus, Trash2, Loader2, AlertCircle, X } from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export type Jenjang = "SD" | "SMP" | "SMA" | "PURNA" | "UMUM"
export type KategoriPenilaian = "PBB" | "Danton" | "Variasi"

export interface PeringkatJuara {
  id: string
  nama: string
  urutanAngka: string // Simpan angka input, misal "3"
  kategori: KategoriPenilaian[]
  jenjang: Jenjang // Spesifik untuk 1 jenjang karena setiap jenjang beda
}

// ==========================================
// 2. CONSTANTS & MOCK DATA
// ==========================================

const JENJANG_LIST: Jenjang[] = ["SD", "SMP", "SMA", "PURNA", "UMUM"]
const KATEGORI_LIST: KategoriPenilaian[] = ["PBB", "Danton", "Variasi"]

const MOCK_DATA: PeringkatJuara[] = [
  {
    id: "j-1",
    nama: "Juara Umum",
    urutanAngka: "3", // Akan di-generate menjadi 1, 2, 3
    kategori: ["PBB", "Danton", "Variasi"],
    jenjang: "SMA",
  },
  {
    id: "j-2",
    nama: "Juara Madya",
    urutanAngka: "3",
    kategori: ["PBB", "Danton"],
    jenjang: "SMA",
  },
  {
    id: "j-3",
    nama: "Juara Pratama",
    urutanAngka: "3",
    kategori: ["PBB"],
    jenjang: "SMA",
  },
  {
    id: "j-4",
    nama: "Juara Favorit",
    urutanAngka: "1",
    kategori: ["Variasi"],
    jenjang: "SMA",
  },
  {
    id: "j-5",
    nama: "Juara Umum SD",
    urutanAngka: "3",
    kategori: ["PBB", "Variasi"],
    jenjang: "SD",
  },
]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

// Fungsi untuk men-generate string urutan "1, 2, 3..." berdasarkan angka input
const generateUrutanString = (value: string) => {
  const num = parseInt(value, 10)
  if (isNaN(num) || num <= 0) return "Tidak ada urutan valid"
  // Batasi maksimal 20 agar tidak terlalu panjang jika diinput angka besar
  const limit = Math.min(num, 20)
  return (
    Array.from({ length: limit }, (_, i) => i + 1).join(", ") +
    (num > 20 ? ", ..." : "")
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function RankingSystemPage() {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState<PeringkatJuara[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [activeJenjang, setActiveJenjang] = useState<Jenjang>("SMA")

  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [selectedJuara, setSelectedJuara] = useState<PeringkatJuara | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // --- FORM STATES ---
  const [formNama, setFormNama] = useState<string>("")
  const [formUrutan, setFormUrutan] = useState<string>("3")
  const [formKategori, setFormKategori] = useState<KategoriPenilaian[]>([])

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/ranking-system di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setData(MOCK_DATA)
      } catch (error) {
        console.error("Gagal memuat data sistem juara:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- FILTER DATA BERDASARKAN JENJANG AKTIF ---
  // Menghitung jumlah per jenjang untuk ditampilkan di pill button
  const getJenjangCounts = () => {
    const counts: Record<string, number> = {
      SD: 0,
      SMP: 0,
      SMA: 0,
      PURNA: 0,
      UMUM: 0,
    }
    data.forEach((j) => {
      if (counts[j.jenjang] !== undefined) counts[j.jenjang]++
    })
    return counts
  }
  const jenjangCounts = getJenjangCounts()

  // Data yang dirender hanya untuk jenjang yang dipilih
  const currentJenjangData = data.filter((j) => j.jenjang === activeJenjang)

  // --- HANDLERS: MODAL TRIGGERS ---
  const resetForm = () => {
    setFormNama("")
    setFormUrutan("3")
    setFormKategori([])
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (juara: PeringkatJuara) => {
    setSelectedJuara(juara)
    setFormNama(juara.nama)
    setFormUrutan(juara.urutanAngka)
    setFormKategori(juara.kategori)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (juara: PeringkatJuara) => {
    setSelectedJuara(juara)
    setIsDeleteModalOpen(true)
  }

  // --- HANDLERS: FORM CHANGES ---
  const handleKategoriToggle = (checked: boolean, val: KategoriPenilaian) => {
    if (checked) setFormKategori((prev) => [...prev, val])
    else setFormKategori((prev) => prev.filter((k) => k !== val))
  }

  // --- HANDLERS: SUBMISSIONS ---
  const isFormValid =
    formNama.trim() !== "" &&
    parseInt(formUrutan, 10) > 0 &&
    formKategori.length > 0

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    setIsSubmitting(true)
    try {
      // TODO: Integrasi API POST /api/organizer/ranking-system
      const newJuara: PeringkatJuara = {
        id: `j-${Date.now()}`,
        nama: formNama,
        urutanAngka: formUrutan,
        kategori: formKategori,
        jenjang: activeJenjang, // Otomatis masuk ke jenjang yang sedang aktif
      }
      await new Promise((res) => setTimeout(res, 1000))
      setData((prev) => [...prev, newJuara])
      setIsAddModalOpen(false)
    } catch (error) {
      alert("Gagal menambah juara.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJuara || !isFormValid) return
    setIsSubmitting(true)
    try {
      // TODO: Integrasi API PUT /api/organizer/ranking-system/{id}
      await new Promise((res) => setTimeout(res, 1000))
      setData((prev) =>
        prev.map((j) =>
          j.id === selectedJuara.id
            ? {
                ...j,
                nama: formNama,
                urutanAngka: formUrutan,
                kategori: formKategori,
              }
            : j
        )
      )
      setIsEditModalOpen(false)
    } catch (error) {
      alert("Gagal mengedit juara.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJuara) return
    setIsSubmitting(true)
    try {
      // TODO: Integrasi API DELETE /api/organizer/ranking-system/{id}
      await new Promise((res) => setTimeout(res, 1000))
      setData((prev) => prev.filter((j) => j.id !== selectedJuara.id))
      setIsDeleteModalOpen(false)
    } catch (error) {
      alert("Gagal menghapus juara.")
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
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Sistem Juara
        </h1>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-8">
            {/* PILIH JENJANG TINGKAT (Bukan Filter) */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <span className="font-poppins text-sm font-medium text-slate-900">
                Pilih Jenjang Tingkat:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {JENJANG_LIST.map((jenjang) => (
                  <Button
                    key={jenjang}
                    variant={activeJenjang === jenjang ? "default" : "outline"}
                    onClick={() => setActiveJenjang(jenjang)}
                    className={cn(
                      "h-9 rounded-lg px-4 py-2 font-poppins text-sm",
                      activeJenjang === jenjang
                        ? "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                        : "border-gray-200 bg-white text-zinc-600 hover:bg-gray-50"
                    )}
                  >
                    {jenjang} ({jenjangCounts[jenjang] || 0})
                  </Button>
                ))}
              </div>
            </div>

            {/* MAIN LIST CARD */}
            <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-poppins text-lg font-medium text-slate-900">
                  Peringkat Juara {activeJenjang}
                </h2>
                <Button
                  onClick={handleOpenAddModal}
                  variant="outline"
                  className="rounded-full border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Tambah Juara
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {currentJenjangData.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center">
                    <p className="font-poppins text-sm text-neutral-500">
                      Belum ada peringkat juara untuk jenjang {activeJenjang}.
                    </p>
                  </div>
                ) : (
                  currentJenjangData.map((juara) => (
                    <div
                      key={juara.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className="font-poppins text-base font-medium text-neutral-700">
                          {juara.nama}
                        </span>
                        <span className="font-poppins text-xs leading-relaxed font-normal text-neutral-500">
                          Urutan: {generateUrutanString(juara.urutanAngka)}{" "}
                          &nbsp;|&nbsp; Kategori: {juara.kategori.join(" + ")}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(juara)}
                          className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteModal(juara)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            MODALS SECTION (API-Ready, Out of Map Loop)
            ========================================= */}

        {/* 1. MODAL TAMBAH/EDIT JUARA */}
        <Dialog
          open={isAddModalOpen || isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddModalOpen(false)
              setIsEditModalOpen(false)
            }
          }}
        >
          <DialogContent className="max-h-[90vh] w-full max-w-xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[32px]">
            <form
              onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}
              className="flex flex-col"
            >
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  {isEditModalOpen
                    ? "Edit Peringkat Juara"
                    : "Tambah Peringkat Juara"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-6 p-6 sm:p-10">
                {/* Field Nama Juara */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="nama"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Nama Juara
                  </Label>
                  <Input
                    id="nama"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Contoh: Juara Umum, Juara Madya"
                    className="h-12 font-poppins text-sm focus-visible:ring-sky-200"
                  />
                </div>

                {/* Field Urutan Juara (Original Logic) */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="urutan"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Jumlah Urutan Juara
                  </Label>
                  <span className="font-poppins text-xs text-neutral-500">
                    Isi dengan angka (misal: 3, untuk juara 1, 2, dan 3)
                  </span>
                  <Input
                    id="urutan"
                    type="number"
                    min="1"
                    value={formUrutan}
                    onChange={(e) => setFormUrutan(e.target.value)}
                    placeholder="Contoh: 3"
                    className="h-12 font-poppins text-sm focus-visible:ring-sky-200"
                  />
                  <p className="mt-1 font-poppins text-xs font-medium text-blue-500">
                    Urutan Juara: {generateUrutanString(formUrutan)}
                  </p>
                </div>

                {/* Field Kategori Penilaian (Checkboxes) */}
                <div className="flex flex-col gap-3 pt-2">
                  <Label className="font-poppins text-sm text-neutral-600">
                    Kategori Penilaian yang Dihitung
                  </Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {KATEGORI_LIST.map((kat) => (
                      <div key={kat} className="flex items-center space-x-2">
                        <Checkbox
                          id={`kat-${kat}`}
                          checked={formKategori.includes(kat)}
                          onCheckedChange={(checked) =>
                            handleKategoriToggle(checked as boolean, kat)
                          }
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label
                          htmlFor={`kat-${kat}`}
                          className="cursor-pointer font-poppins text-sm leading-tight font-normal text-neutral-700"
                        >
                          {kat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false)
                      setIsEditModalOpen(false)
                    }}
                    className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
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

        {/* 2. MODAL HAPUS JUARA */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={handleDeleteSubmit} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  Konfirmasi Hapus
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-8 p-6 sm:p-10">
                <p className="text-center font-poppins text-sm text-neutral-600">
                  Apakah Anda yakin hapus peringkat juara <br />
                  <span className="font-semibold text-red-500">
                    {selectedJuara?.nama}
                  </span>
                  ?
                </p>

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
                      "Hapus"
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
