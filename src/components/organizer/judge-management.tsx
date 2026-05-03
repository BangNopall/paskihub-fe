"use client"

import React, { useState } from "react"
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

// --- SHADCN UI COMPONENTS ---
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

// --- CUSTOM IMPORTS ---
import { Judge } from "@/services/judge.service"
import {
  createJudgeAction,
  updateJudgeAction,
  deleteJudgeAction,
} from "@/actions/judge.actions"

interface JudgeManagementProps {
  eventId: string
  initialJudges: Judge[]
}

export default function JudgeManagement({
  eventId,
  initialJudges,
}: JudgeManagementProps) {
  // --- MODAL & FORM STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null)
  const [judgeFormName, setJudgeFormName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // --- HANDLERS: MODAL TRIGGERS ---
  const handleOpenAddModal = () => {
    setJudgeFormName("")
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (judge: Judge) => {
    setSelectedJudge(judge)
    setJudgeFormName(judge.name)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (judge: Judge) => {
    setSelectedJudge(judge)
    setIsDeleteModalOpen(true)
  }

  // --- HANDLERS: CRUD SUBMISSIONS ---
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!judgeFormName.trim()) return

    setIsSubmitting(true)
    const result = await createJudgeAction(eventId, judgeFormName)
    setIsSubmitting(false)

    if (result.success) {
      toast.success(result.message)
      setIsAddModalOpen(false)
      setJudgeFormName("")
    } else {
      toast.error(result.message)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJudge || !judgeFormName.trim()) return

    setIsSubmitting(true)
    const result = await updateJudgeAction(
      eventId,
      selectedJudge.id,
      judgeFormName
    )
    setIsSubmitting(false)

    if (result.success) {
      toast.success(result.message)
      setIsEditModalOpen(false)
      setSelectedJudge(null)
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJudge) return

    setIsSubmitting(true)
    const result = await deleteJudgeAction(eventId, selectedJudge.id)
    setIsSubmitting(false)

    if (result.success) {
      toast.success(result.message)
      setIsDeleteModalOpen(false)
      setSelectedJudge(null)
    } else {
      toast.error(result.message)
    }
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
          <div className="flex flex-col gap-3 md:gap-4">
            {initialJudges.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-12">
                <p className="font-poppins text-sm text-neutral-500">
                  Belum ada data juri terdaftar.
                </p>
              </div>
            ) : (
              initialJudges.map((judge) => (
                <div
                  key={judge.id}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 hover:bg-slate-50/50"
                >
                  <span className="max-w-[70%] truncate font-poppins text-base font-normal text-zinc-600">
                    {judge.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(judge)}
                      className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      aria-label={`Edit ${judge.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteModal(judge)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Hapus ${judge.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODALS */}
        {/* TAMBAH JURI */}
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
                    value={judgeFormName}
                    onChange={(e) => setJudgeFormName(e.target.value)}
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
                    disabled={isSubmitting || !judgeFormName.trim()}
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

        {/* EDIT JURI */}
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
                    value={judgeFormName}
                    onChange={(e) => setJudgeFormName(e.target.value)}
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
                    disabled={isSubmitting || !judgeFormName.trim()}
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

        {/* HAPUS JURI */}
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
                    "{selectedJudge?.name}"
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
