"use client"

import { Pencil, Plus, Trash2, X, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field } from "@/components/ui/field"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Juara = [
  { id: "1", nama: "Juara Umum" },
  { id: "2", nama: "Juara Harapan" },
  { id: "3", nama: "Juara Madya" },
]
export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Sistem juara */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Sistem Juara
            </CardTitle>
            <CardAction className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
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
                  <Button variant="secondary" size="sm" className="w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori Juara
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-dark-blue">
                      Tambah Kategori Juara
                    </DialogTitle>
                    <Separator className="mt-4" />
                  </DialogHeader>
                  <div className="relative w-full px-6 pb-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label
                          htmlFor="kategori-juara-baru"
                          className="text-sm text-neutral-500"
                        >
                          Kategori Juara
                        </Label>
                        <Input
                          id="kategori-juara-baru"
                          placeholder="Contoh: Juara Umum, Pelatih Terbaik"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="urutan-juara-baru"
                          className="text-sm text-neutral-500"
                        >
                          Urutan Juara
                        </Label>
                        <span className="text-xs text-neutral-300">
                          Isi dengan angka untuk menentukan jumlah urutan juara
                        </span>
                        <Input id="urutan-juara-baru" placeholder="Contoh: 3" />
                        <span className="text-secondary-400">
                          urutan Juara: 1, 2, 3
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="urutan-juara-baru"
                          className="text-sm text-neutral-500"
                        >
                          Kategori Penilaian
                        </Label>
                        <div className="flex flex-wrap gap-4">
                          <Field orientation="horizontal" className="w-auto">
                            <Checkbox id="pbb-checkbox" name="pbb-checkbox" />
                            <Label htmlFor="pbb-checkbox">PBB</Label>
                          </Field>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="urutan-juara-baru"
                          className="text-sm text-neutral-500"
                        >
                          Jenjang Tingkat
                        </Label>
                        <span className="text-xs text-neutral-300">
                          Pilih jenjang tingkat untuk juara ini (juara per
                          tingkat)
                        </span>
                        <div className="flex flex-wrap gap-4 pt-2">
                          <Field orientation="horizontal" className="w-auto">
                            <Checkbox id="sd-checkbox" name="sd-checkbox" />
                            <Label htmlFor="sd-checkbox">SD</Label>
                          </Field>
                        </div>
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
              {Juara.map((juara) => (
                <Card
                  key={juara.id}
                  className="w-full rounded-2xl border-neutral-50 bg-white shadow-none"
                >
                  <CardContent className="flex w-full items-center justify-between">
                    {/* Nama pelanggaran */}
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <span className="text-sm font-normal text-neutral-600 sm:text-base">
                        {juara.nama}
                      </span>
                      <span className="text-xs font-normal text-neutral-400">
                        Urutan: Harapan 1 | Kategori: PBB + Danton + Variasi |
                        Per Jenjang: SD, SMP, SMA
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
                            aria-label={`Edit data ${juara.nama}`}
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
                                  htmlFor={`edit-nama-${juara.id}`}
                                  className="text-sm text-neutral-500"
                                >
                                  Nama pelanggaran
                                </Label>
                                <Input
                                  id={`edit-nama-${juara.id}`}
                                  defaultValue={juara.nama}
                                  placeholder="Masukkan Nama Pelanggaran"
                                />
                              </div>
                              <div className="mb-10 space-y-1">
                                <Label
                                  htmlFor={`edit-poin-${juara.id}`}
                                  className="text-sm text-neutral-500"
                                >
                                  Poin Pelanggaran
                                </Label>
                                <Input
                                  id={`edit-poin-${juara.id}`}
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
                            aria-label={`Hapus data ${juara.nama}`}
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
                                {juara.nama}
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
      </div>
    </div>
  )
}
