"use client"

import { Pencil, Plus, Trash2, X, Filter, ChevronDown } from "lucide-react"
import { useState, MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Pelanggaran = [
  { id: "1", nama: "Tidak Seragam" },
  { id: "2", nama: "Tidak Memakai Topi" },
  { id: "3", nama: "Tidak Memakai Sepatu" },
]

interface SubKategori {
  id: string
  title: string
  maxScore: number
}

interface KategoriItemProps {
  title?: string
  totalSub?: number
  totalScore?: number
  subCategories?: SubKategori[]
}

type GradeKey = "kurang" | "cukup" | "baik" | "sangatBaik"

const GRADE_CONFIG = [
  { key: "kurang", label: "Kurang", bgColor: "bg-red-400 hover:bg-red-500" },
  { key: "cukup", label: "Cukup", bgColor: "bg-amber-400 hover:bg-amber-500" },
  { key: "baik", label: "Baik", bgColor: "bg-green-400 hover:bg-green-500" },
  {
    key: "sangatBaik",
    label: "Sangat Baik",
    bgColor: "bg-blue-400 hover:bg-blue-500",
  },
] as const

export default function Page({
  title = "PBB (Peraturan Baris Berbaris)",
  totalSub = 3,
  totalScore = 100,
  subCategories = [
    { id: "1", title: "Gerakan di Tempat", maxScore: 40 },
    { id: "2", title: "Langkah Tegap", maxScore: 40 },
    { id: "3", title: "Kerapian", maxScore: 20 },
  ],
}: KategoriItemProps) {
  const [grades, setGrades] = useState<Record<GradeKey, string[]>>({
    kurang: [""],
    cukup: [""],
    baik: [""],
    sangatBaik: [""],
  })

  // Handler untuk mengubah nilai input pada index tertentu per grade
  const handleInputChange = (grade: GradeKey, index: number, value: string) => {
    // Hanya menerima 1 karakter yg sudah di limit via backend / atau max 3 karakter di mari
    if (value.length > 3) return

    setGrades((prev) => {
      const newCodes = [...prev[grade]]
      newCodes[index] = value
      return { ...prev, [grade]: newCodes }
    })
  }

  // Handler untuk menambah kotak input baru (maksimal 6) per grade
  const handleAddInput = (grade: GradeKey) => {
    setGrades((prev) => {
      if (prev[grade].length < 6) {
        return { ...prev, [grade]: [...prev[grade], ""] }
      }
      return prev
    })
  }

  // Handler untuk menghapus kotak input per grade
  const handleRemoveInput = (grade: GradeKey, index: number) => {
    setGrades((prev) => {
      if (prev[grade].length > 1) {
        const newCodes = prev[grade].filter((_, i) => i !== index)
        return { ...prev, [grade]: newCodes }
      }
      return prev
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Pelanggaran */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Pelanggaran
            </CardTitle>
            <CardAction>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Pelanggaran
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-dark-blue">
                      Tambah Pelanggaran
                    </DialogTitle>
                    <Separator className="mt-4" />
                  </DialogHeader>
                  <div className="relative w-full px-6 pb-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label
                          htmlFor="pelanggaran-baru"
                          className="text-sm text-neutral-500"
                        >
                          Nama pelanggaran
                        </Label>
                        <Input
                          id="pelanggaran-baru"
                          placeholder="Masukkan Nama Pelanggaran"
                        />
                      </div>
                      <div className="mb-10 space-y-1">
                        <Label
                          htmlFor="poin-baru"
                          className="text-sm text-neutral-500"
                        >
                          Poin Pelanggaran
                        </Label>
                        <Input
                          id="poin-baru"
                          placeholder="Masukkan Poin Pelanggaran"
                        />
                        <span className="text-xs text-neutral-400">
                          Poin yang akan dikurangi dari total skor
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 flex w-full flex-row items-center justify-center gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="flex-1">
                          Batal
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        variant="default"
                        className="flex-1"
                      >
                        Tambah
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data pelanggaran */}
            <div className="relative flex w-full flex-col items-start justify-start gap-4 rounded-lg">
              {Pelanggaran.map((juri) => (
                <Card
                  key={juri.id}
                  className="w-full rounded-2xl border-neutral-50 bg-white shadow-none"
                >
                  <CardContent className="flex w-full items-center justify-between">
                    {/* Nama pelanggaran */}
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <span className="text-sm font-normal text-neutral-600 sm:text-base">
                        {juri.nama}
                      </span>
                      <span className="text-xs font-normal text-neutral-400">
                        Pengurangan{" "}
                        <span className="font-medium text-danger-500">
                          5 poin
                        </span>
                      </span>
                    </div>

                    {/* Action Buttons (Edit & Delete) */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-info-500 hover:bg-info-50 hover:text-info-600"
                            aria-label={`Edit data ${juri.nama}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                          <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-xl font-bold text-dark-blue">
                              Edit Pelanggaran
                            </DialogTitle>
                            <Separator className="mt-4" />
                          </DialogHeader>
                          <div className="relative w-full px-6 pb-6">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`edit-nama-${juri.id}`}
                                  className="text-sm text-neutral-500"
                                >
                                  Nama pelanggaran
                                </Label>
                                <Input
                                  id={`edit-nama-${juri.id}`}
                                  defaultValue={juri.nama}
                                  placeholder="Masukkan Nama Pelanggaran"
                                />
                              </div>
                              <div className="mb-10 space-y-1">
                                <Label
                                  htmlFor={`edit-poin-${juri.id}`}
                                  className="text-sm text-neutral-500"
                                >
                                  Poin Pelanggaran
                                </Label>
                                <Input
                                  id={`edit-poin-${juri.id}`}
                                  defaultValue="5"
                                  placeholder="Masukkan Poin Pelanggaran"
                                />
                                <span className="text-xs text-neutral-400">
                                  Poin yang akan dikurangi dari total skor
                                </span>
                              </div>
                            </div>
                            <div className="mt-6 flex w-full flex-row items-center justify-center gap-2">
                              <DialogClose asChild>
                                <Button variant="outline" className="flex-1">
                                  Batal
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                variant="default"
                                className="flex-1"
                              >
                                Simpan
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-danger-500 hover:bg-danger-50 hover:text-danger-600"
                            aria-label={`Hapus data ${juri.nama}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                          <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-xl font-bold text-dark-blue">
                              Konfirmasi Hapus Pelanggaran
                            </DialogTitle>
                            <Separator className="mt-4" />
                          </DialogHeader>
                          <div className="relative w-full px-6 pb-6">
                            <div className="mb-10 text-center text-sm font-normal text-neutral-500">
                              Apakah Anda yakin hapus pelanggaran ini?{" "}
                              <span className="text-sm font-semibold text-danger-500">
                                {juri.nama}
                              </span>
                            </div>
                            <div className="flex w-full flex-row items-center justify-center gap-2">
                              <DialogClose asChild>
                                <Button variant="outline" className="flex-1">
                                  Batal
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                variant="destructive"
                                className="flex-1"
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kategori dan Sub Kategori */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Kategori dan Sub Kategori Penilaian
            </CardTitle>
            <CardAction className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="shrink-0 justify-between rounded-lg border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 hover:text-neutral-900 sm:w-auto sm:justify-center"
                  >
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-neutral-500" />
                      Filter by
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 text-neutral-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-45 rounded-lg border-neutral-200 bg-white shadow-lg sm:w-32"
                >
                  <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                    Color
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                    Category
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                    Price
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-neutral-100">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-dark-blue">
                      Tambah Kategori
                    </DialogTitle>
                    <Separator className="mt-4" />
                  </DialogHeader>
                  <div className="relative w-full px-6 pb-6">
                    <div className="mb-10 space-y-1">
                      <Label
                        htmlFor="kategori-baru"
                        className="text-sm text-neutral-500"
                      >
                        Nama Kategori
                      </Label>
                      <Input
                        id="kategori-baru"
                        placeholder="Masukkan Nama kategori"
                      />
                    </div>
                    <div className="flex w-full flex-row items-center justify-center gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="flex-1">
                          Batal
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        variant="default"
                        className="flex-1"
                      >
                        Tambah
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardAction>
          </CardHeader>
          <CardContent className="h-full w-full space-y-6">
            <Accordion
              type="multiple"
              defaultValue={["kategori-1"]}
              className="w-full space-y-4"
            >
              <AccordionItem
                value="kategori-1"
                className="rounded-2xl border-none"
              >
                <div className="w-full flex-1 items-center rounded-t-2xl bg-primary-100">
                  <AccordionTrigger className="w-full px-4 py-4 hover:no-underline sm:px-6 sm:py-6">
                    <div className="flex w-full flex-col gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-base font-medium text-neutral-700">
                        {title}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="hidden h-5 bg-neutral-400 sm:block"
                      />
                      <span className="text-xs font-normal text-neutral-500">
                        {totalSub} Sub-Kategori | Total: {totalScore} poin
                      </span>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="h-full w-full rounded-b-2xl p-4 pb-6 sm:p-6">
                  <div className="flex w-full flex-col gap-4">
                    {subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex w-full flex-col gap-3 rounded-2xl border border-neutral-50 bg-white p-4 transition-all hover:border-sky-200 sm:px-6"
                      >
                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-semibold text-neutral-800">
                                {sub.title}
                              </span>
                              <span className="text-xs font-normal text-neutral-500">
                                Skor maksimal: {sub.maxScore} poin
                              </span>
                            </div>

                            {/* Range Badges */}
                            <div className="mt-1 flex flex-wrap gap-2">
                              {GRADE_CONFIG.map(({ key, label, bgColor }) => {
                                const rangeText =
                                  key === "kurang"
                                    ? "0, 2, 10"
                                    : key === "cukup"
                                      ? "11, 20"
                                      : key === "baik"
                                        ? "21, 30"
                                        : "31, 40"
                                return (
                                  <Badge
                                    key={key}
                                    className={`${bgColor} font-medium text-white`}
                                  >
                                    {label}: {rangeText}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>

                          {/* Aksi Sub-Kategori */}
                          <div className="flex items-center gap-1 self-start sm:gap-2 sm:self-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-info-500 hover:bg-info-50 hover:text-info-600"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                <DialogHeader className="p-6 pb-2">
                                  <DialogTitle className="text-xl font-bold text-dark-blue">
                                    Edit Sub-Kategori
                                  </DialogTitle>
                                  <Separator className="mt-4" />
                                </DialogHeader>
                                <div className="relative w-full px-6 pb-6">
                                  <Tabs
                                    defaultValue="name"
                                    className="mb-5 w-full"
                                  >
                                    <TabsList className="w-full">
                                      <TabsTrigger
                                        value="name"
                                        className="w-1/2"
                                      >
                                        Nama
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="grade"
                                        className="w-1/2"
                                      >
                                        Grade
                                      </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="name" className="pt-2">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>
                                            Nama Sub-Kategori
                                          </CardTitle>
                                          <CardDescription>
                                            Edit sub kategori baru
                                          </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                          <Input
                                            id="subKategoriNama"
                                            placeholder="Masukkan Sub-Kategori"
                                          />
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="grade" className="pt-2">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Grade</CardTitle>
                                          <CardDescription>
                                            Buat opsi score penilaian pada sub
                                            kategori ini untuk juri
                                          </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                          {GRADE_CONFIG.map(
                                            ({ key, label, bgColor }) => (
                                              <div
                                                key={key}
                                                className="flex flex-col gap-3"
                                              >
                                                <Badge
                                                  variant="secondary"
                                                  className={`${bgColor} w-max p-2 px-4 text-sm font-medium text-white`}
                                                >
                                                  {label}
                                                </Badge>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                  {grades[key as GradeKey].map(
                                                    (code, index) => (
                                                      <div
                                                        key={index}
                                                        className="relative"
                                                      >
                                                        <label
                                                          htmlFor={`code-${key}-${index}`}
                                                          className="sr-only"
                                                        >
                                                          Code {key} {index + 1}
                                                        </label>
                                                        <Input
                                                          id={`code-${key}-${index}`}
                                                          type="text"
                                                          maxLength={3}
                                                          value={code}
                                                          onChange={(e) =>
                                                            handleInputChange(
                                                              key as GradeKey,
                                                              index,
                                                              e.target.value
                                                            )
                                                          }
                                                          className="h-10 w-16 rounded-lg border-neutral-300 bg-neutral-50 text-center text-base font-semibold text-neutral-900 sm:h-12 sm:w-20 sm:text-lg"
                                                          required
                                                        />

                                                        {grades[key as GradeKey]
                                                          .length > 1 && (
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleRemoveInput(
                                                                key as GradeKey,
                                                                index
                                                              )
                                                            }
                                                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 transition-colors hover:bg-red-200"
                                                            aria-label={`Hapus kode ${index + 1}`}
                                                          >
                                                            <X className="h-3 w-3" />
                                                          </button>
                                                        )}
                                                      </div>
                                                    )
                                                  )}

                                                  {/* Tombol Plus (Hanya tampil jika kurang dari 6) */}
                                                  {grades[key as GradeKey]
                                                    .length < 6 && (
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() =>
                                                        handleAddInput(
                                                          key as GradeKey
                                                        )
                                                      }
                                                      className="h-10 w-10 shrink-0 rounded-lg border-dashed border-neutral-300 bg-white text-neutral-500 shadow-sm hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 sm:h-12 sm:w-12"
                                                      aria-label={`Tambah input kode untuk ${label}`}
                                                    >
                                                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </Button>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </Tabs>
                                  <div className="mt-4 flex w-full flex-row items-center justify-center gap-2">
                                    <DialogClose asChild>
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                      >
                                        Batal
                                      </Button>
                                    </DialogClose>
                                    <Button
                                      type="submit"
                                      variant="default"
                                      className="flex-1"
                                    >
                                      Edit Sub-Kategori
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-danger-500 hover:bg-danger-50 hover:text-danger-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                <DialogHeader className="p-6 pb-2">
                                  <DialogTitle className="text-xl font-bold text-dark-blue">
                                    Konfirmasi Hapus Sub-Kategori
                                  </DialogTitle>
                                  <Separator className="mt-4" />
                                </DialogHeader>
                                <div className="relative w-full px-6 pb-6">
                                  <div className="mb-10 text-center text-sm font-normal text-neutral-500">
                                    Apakah Anda yakin hapus sub-kategori ini?{" "}
                                    <span className="text-sm font-semibold text-danger-500">
                                      {sub.title}
                                    </span>
                                  </div>
                                  <div className="flex w-full flex-row items-center justify-center gap-2">
                                    <DialogClose asChild>
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                      >
                                        Batal
                                      </Button>
                                    </DialogClose>
                                    <Button
                                      type="submit"
                                      variant="destructive"
                                      className="flex-1"
                                    >
                                      Hapus
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* --- TOMBOL TAMBAH SUB-KATEGORI --- */}
                    <div className="mt-2 flex w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            className="w-full sm:w-auto"
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Tambah Sub-Kategori
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl lg:max-w-3xl">
                          <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-xl font-bold text-dark-blue">
                              Tambah Sub-Kategori
                            </DialogTitle>
                            <Separator className="mt-4" />
                          </DialogHeader>
                          <div className="relative w-full px-6 pb-6">
                            <Tabs defaultValue="name" className="mb-5 w-full">
                              <TabsList className="w-full">
                                <TabsTrigger value="name" className="w-1/2">
                                  Nama
                                </TabsTrigger>
                                <TabsTrigger value="grade" className="w-1/2">
                                  Grade
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="name" className="pt-2">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Nama Sub-Kategori</CardTitle>
                                    <CardDescription>
                                      Tambah sub kategori baru
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <Input
                                      id="subKategoriNama"
                                      placeholder="Masukkan Sub-Kategori"
                                    />
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="grade" className="pt-2">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Grade</CardTitle>
                                    <CardDescription>
                                      Buat opsi score penilaian pada sub
                                      kategori ini untuk juri
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-6">
                                    {GRADE_CONFIG.map(
                                      ({ key, label, bgColor }) => (
                                        <div
                                          key={key}
                                          className="flex flex-col gap-3"
                                        >
                                          <Badge
                                            variant="secondary"
                                            className={`${bgColor} w-max p-2 px-4 text-sm font-medium text-white`}
                                          >
                                            {label}
                                          </Badge>
                                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            {grades[key as GradeKey].map(
                                              (code, index) => (
                                                <div
                                                  key={index}
                                                  className="relative"
                                                >
                                                  <label
                                                    htmlFor={`code-${key}-${index}`}
                                                    className="sr-only"
                                                  >
                                                    Code {key} {index + 1}
                                                  </label>
                                                  <Input
                                                    id={`code-${key}-${index}`}
                                                    type="text"
                                                    maxLength={3}
                                                    value={code}
                                                    onChange={(e) =>
                                                      handleInputChange(
                                                        key as GradeKey,
                                                        index,
                                                        e.target.value
                                                      )
                                                    }
                                                    className="h-10 w-16 rounded-lg border-neutral-300 bg-neutral-50 text-center text-base font-semibold text-neutral-900 sm:h-12 sm:w-20 sm:text-lg"
                                                    required
                                                  />

                                                  {grades[key as GradeKey]
                                                    .length > 1 && (
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        handleRemoveInput(
                                                          key as GradeKey,
                                                          index
                                                        )
                                                      }
                                                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 transition-colors hover:bg-red-200"
                                                      aria-label={`Hapus kode ${index + 1}`}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </button>
                                                  )}
                                                </div>
                                              )
                                            )}

                                            {/* Tombol Plus (Hanya tampil jika kurang dari 6) */}
                                            {grades[key as GradeKey].length <
                                              6 && (
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                  handleAddInput(
                                                    key as GradeKey
                                                  )
                                                }
                                                className="h-10 w-10 shrink-0 rounded-lg border-dashed border-neutral-300 bg-white text-neutral-500 shadow-sm hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 sm:h-12 sm:w-12"
                                                aria-label={`Tambah input kode untuk ${label}`}
                                              >
                                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                            <div className="mt-4 flex w-full flex-row items-center justify-center gap-2">
                              <DialogClose asChild>
                                <Button variant="outline" className="flex-1">
                                  Batal
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                variant="default"
                                className="flex-1"
                              >
                                Simpan Sub-Kategori
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
