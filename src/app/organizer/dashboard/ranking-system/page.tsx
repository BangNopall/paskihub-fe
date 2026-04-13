"use client"

import * as React from "react"
import { Pencil, Plus, Trash2, Filter, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field } from "@/components/ui/field"
import {
  Card,
  CardAction,
  CardContent,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data dummy juara
const Juara = [
  { id: "1", nama: "Juara Umum" },
  { id: "2", nama: "Juara Harapan" },
  { id: "3", nama: "Juara Madya" },
]

export default function RankingSystemPage() {
  // State untuk menangani nilai input urutan juara
  const [urutanJuaraInput, setUrutanJuaraInput] = React.useState("3")

  // Fungsi pembantu untuk men-generate string urutan "1, 2, 3..." berdasarkan angka input
  const generateUrutanString = (value: string) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num <= 0) return "Tidak ada urutan valid"
    // Batasi maksimal misal 20 agar tidak terlalu panjang jika diinput angka besar
    const limit = Math.min(num, 20)
    return (
      Array.from({ length: limit }, (_, i) => i + 1).join(", ") +
      (num > 20 ? ", ..." : "")
    )
  }

  return (
    <div className="flex flex-1 flex-col font-['Poppins']">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* --- MAIN CARD --- */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="font-['Montserrat'] text-xl font-bold text-dark-blue">
              Sistem Juara
            </CardTitle>

            <CardAction className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-lg border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 hover:text-neutral-900 sm:w-auto"
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
                  className="w-full rounded-lg shadow-lg sm:w-48"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    Semua Kategori
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    SD
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    SMP
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    SMA
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dialog Tambah Kategori Juara */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="default"
                    className="w-full bg-primary-600 hover:bg-primary-700 sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori Juara
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-xl">
                  {/* Fixed Header */}
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="font-['Montserrat'] text-xl font-bold text-dark-blue">
                      Tambah Kategori Juara
                    </DialogTitle>
                    <Separator className="mt-4" />
                  </DialogHeader>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="space-y-6">
                      {/* Input Nama Kategori */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="kategori-juara-baru"
                          className="text-sm font-medium text-neutral-700"
                        >
                          Nama Kategori Juara
                        </Label>
                        <Input
                          id="kategori-juara-baru"
                          placeholder="Contoh: Juara Umum, Pelatih Terbaik"
                        />
                      </div>

                      {/* Input Urutan Juara (Dinamis) */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="urutan-juara-baru"
                          className="text-sm font-medium text-neutral-700"
                        >
                          Jumlah Urutan Juara
                        </Label>
                        <p className="text-xs text-neutral-500">
                          Isi dengan angka (misal: 3, untuk juara 1, 2, dan 3)
                        </p>
                        <Input
                          id="urutan-juara-baru"
                          type="number"
                          min="1"
                          value={urutanJuaraInput}
                          onChange={(e) => setUrutanJuaraInput(e.target.value)}
                          placeholder="Contoh: 3"
                        />
                        <p className="text-sm font-medium text-info-600">
                          Urutan Juara: {generateUrutanString(urutanJuaraInput)}
                        </p>
                      </div>

                      {/* Kategori Penilaian Checkboxes */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-neutral-700">
                          Kategori Penilaian yang Dihitung
                        </Label>
                        <div className="flex flex-wrap gap-4">
                          <Field
                            orientation="horizontal"
                            className="flex w-auto items-center space-x-2"
                          >
                            <Checkbox id="pbb-checkbox" />
                            <Label
                              htmlFor="pbb-checkbox"
                              className="cursor-pointer font-normal"
                            >
                              PBB
                            </Label>
                          </Field>
                          <Field
                            orientation="horizontal"
                            className="flex w-auto items-center space-x-2"
                          >
                            <Checkbox id="danton-checkbox" />
                            <Label
                              htmlFor="danton-checkbox"
                              className="cursor-pointer font-normal"
                            >
                              Danton
                            </Label>
                          </Field>
                          <Field
                            orientation="horizontal"
                            className="flex w-auto items-center space-x-2"
                          >
                            <Checkbox id="variasi-checkbox" />
                            <Label
                              htmlFor="variasi-checkbox"
                              className="cursor-pointer font-normal"
                            >
                              Variasi & Formasi
                            </Label>
                          </Field>
                        </div>
                      </div>

                      {/* Jenjang Tingkat Checkboxes */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-neutral-700">
                          Jenjang Tingkat
                        </Label>
                        <p className="text-xs text-neutral-500">
                          Pilih jenjang tingkat untuk juara ini
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Field
                            orientation="horizontal"
                            className="flex w-auto items-center space-x-2"
                          >
                            <Checkbox id="sd-checkbox" />
                            <Label
                              htmlFor="sd-checkbox"
                              className="cursor-pointer font-normal"
                            >
                              SD / Sederajat
                            </Label>
                          </Field>
                          <Field
                            orientation="horizontal"
                            className="flex w-auto items-center space-x-2"
                          >
                            <Checkbox id="smp-checkbox" />
                            <Label
                              htmlFor="smp-checkbox"
                              className="cursor-pointer font-normal"
                            >
                              SMP / Sederajat
                            </Label>
                          </Field>
                          <Field
                            orientation="horizontal"
                            className="flex w-auto items-center space-x-2"
                          >
                            <Checkbox id="sma-checkbox" />
                            <Label
                              htmlFor="sma-checkbox"
                              className="cursor-pointer font-normal"
                            >
                              SMA / Sederajat
                            </Label>
                          </Field>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Dialog */}
                    <div className="mt-8 flex w-full flex-row items-center justify-end gap-3">
                      <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Batal
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        className="w-full bg-primary-600 hover:bg-primary-700 sm:w-auto"
                      >
                        Tambah Juara
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardAction>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* List Kategori Juara */}
            <div className="flex w-full flex-col gap-4">
              {Juara.map((juara) => (
                <Card
                  key={juara.id}
                  className="w-full rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                >
                  <CardContent className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    {/* Info Kategori Juara */}
                    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                      <span className="text-base font-semibold text-neutral-800">
                        {juara.nama}
                      </span>
                      <span className="text-sm leading-relaxed font-normal text-neutral-500">
                        Urutan: 1, 2, 3 <br className="sm:hidden" />
                        <span className="hidden sm:inline"> | </span>
                        Penilaian: PBB, Danton, Variasi{" "}
                        <br className="sm:hidden" />
                        <span className="hidden sm:inline"> | </span>
                        Jenjang: SD, SMP, SMA
                      </span>
                    </div>

                    {/* Action Buttons (Edit & Delete) */}
                    <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                      {/* DIALOG EDIT */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                            aria-label={`Edit ${juara.nama}`}
                          >
                            <Pencil className="h-[18px] w-[18px]" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-xl">
                          {/* Fixed Header */}
                          <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="font-['Montserrat'] text-xl font-bold text-dark-blue">
                              Edit Kategori Juara
                            </DialogTitle>
                            <Separator className="mt-4" />
                          </DialogHeader>

                          {/* Scrollable Content */}
                          <div className="flex-1 overflow-y-auto px-6 pb-6">
                            <div className="space-y-6">
                              {/* Input Nama Kategori */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="kategori-juara-baru"
                                  className="text-sm font-medium text-neutral-700"
                                >
                                  Nama Kategori Juara
                                </Label>
                                <Input
                                  id="kategori-juara-baru"
                                  placeholder="Contoh: Juara Umum, Pelatih Terbaik"
                                />
                              </div>

                              {/* Input Urutan Juara (Dinamis) */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="urutan-juara-baru"
                                  className="text-sm font-medium text-neutral-700"
                                >
                                  Jumlah Urutan Juara
                                </Label>
                                <p className="text-xs text-neutral-500">
                                  Isi dengan angka (misal: 3, untuk juara 1, 2,
                                  dan 3)
                                </p>
                                <Input
                                  id="urutan-juara-baru"
                                  type="number"
                                  min="1"
                                  value={urutanJuaraInput}
                                  onChange={(e) =>
                                    setUrutanJuaraInput(e.target.value)
                                  }
                                  placeholder="Contoh: 3"
                                />
                                <p className="text-sm font-medium text-info-600">
                                  Urutan Juara:{" "}
                                  {generateUrutanString(urutanJuaraInput)}
                                </p>
                              </div>

                              {/* Kategori Penilaian Checkboxes */}
                              <div className="space-y-3">
                                <Label className="text-sm font-medium text-neutral-700">
                                  Kategori Penilaian yang Dihitung
                                </Label>
                                <div className="flex flex-wrap gap-4">
                                  <Field
                                    orientation="horizontal"
                                    className="flex w-auto items-center space-x-2"
                                  >
                                    <Checkbox id="pbb-checkbox" />
                                    <Label
                                      htmlFor="pbb-checkbox"
                                      className="cursor-pointer font-normal"
                                    >
                                      PBB
                                    </Label>
                                  </Field>
                                  <Field
                                    orientation="horizontal"
                                    className="flex w-auto items-center space-x-2"
                                  >
                                    <Checkbox id="danton-checkbox" />
                                    <Label
                                      htmlFor="danton-checkbox"
                                      className="cursor-pointer font-normal"
                                    >
                                      Danton
                                    </Label>
                                  </Field>
                                  <Field
                                    orientation="horizontal"
                                    className="flex w-auto items-center space-x-2"
                                  >
                                    <Checkbox id="variasi-checkbox" />
                                    <Label
                                      htmlFor="variasi-checkbox"
                                      className="cursor-pointer font-normal"
                                    >
                                      Variasi & Formasi
                                    </Label>
                                  </Field>
                                </div>
                              </div>

                              {/* Jenjang Tingkat Checkboxes */}
                              <div className="space-y-3">
                                <Label className="text-sm font-medium text-neutral-700">
                                  Jenjang Tingkat
                                </Label>
                                <p className="text-xs text-neutral-500">
                                  Pilih jenjang tingkat untuk juara ini
                                </p>
                                <div className="flex flex-wrap gap-4">
                                  <Field
                                    orientation="horizontal"
                                    className="flex w-auto items-center space-x-2"
                                  >
                                    <Checkbox id="sd-checkbox" />
                                    <Label
                                      htmlFor="sd-checkbox"
                                      className="cursor-pointer font-normal"
                                    >
                                      SD / Sederajat
                                    </Label>
                                  </Field>
                                  <Field
                                    orientation="horizontal"
                                    className="flex w-auto items-center space-x-2"
                                  >
                                    <Checkbox id="smp-checkbox" />
                                    <Label
                                      htmlFor="smp-checkbox"
                                      className="cursor-pointer font-normal"
                                    >
                                      SMP / Sederajat
                                    </Label>
                                  </Field>
                                  <Field
                                    orientation="horizontal"
                                    className="flex w-auto items-center space-x-2"
                                  >
                                    <Checkbox id="sma-checkbox" />
                                    <Label
                                      htmlFor="sma-checkbox"
                                      className="cursor-pointer font-normal"
                                    >
                                      SMA / Sederajat
                                    </Label>
                                  </Field>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons Dialog */}
                            <div className="mt-8 flex w-full flex-row items-center justify-end gap-3">
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                >
                                  Batal
                                </Button>
                              </DialogClose>
                              <Button
                                type="button"
                                className="w-full bg-primary-600 hover:bg-primary-700 sm:w-auto"
                              >
                                Simpan
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* DIALOG HAPUS */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Hapus ${juara.nama}`}
                          >
                            <Trash2 className="h-[18px] w-[18px]" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="p-6 sm:max-w-md">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-center font-['Montserrat'] text-xl font-bold text-neutral-900">
                              Hapus Kategori
                            </DialogTitle>
                          </DialogHeader>

                          <div className="mb-8 text-center text-sm font-normal text-neutral-600">
                            Apakah Anda yakin ingin menghapus kategori juara{" "}
                            <br />
                            <span className="mt-2 block text-base font-semibold text-neutral-900">
                              "{juara.nama}"?
                            </span>
                            <span className="mt-2 block text-xs text-red-500">
                              Tindakan ini tidak dapat dibatalkan.
                            </span>
                          </div>

                          <div className="flex w-full flex-row items-center justify-center gap-3">
                            <DialogClose asChild>
                              <Button variant="outline" className="flex-1">
                                Batal
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              variant="destructive"
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
                            </Button>
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
      </div>
    </div>
  )
}
