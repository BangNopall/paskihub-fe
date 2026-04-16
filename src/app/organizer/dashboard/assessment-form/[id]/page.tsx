"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Search,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  RotateCcw,
  Save,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DetailRowProps {
  label: string
  value?: string
  valueNode?: React.ReactNode
  className?: string
}

const products = [
  {
    id: "21",
    name: "Tim1",
    color: "Silver",
    category: "Laptop",
    price: "$2999",
  },
  {
    id: "22",
    name: "Microsoft Surface Pro",
    color: "White",
    category: "Laptop PC",
    price: "$1999",
  },
  {
    id: "23",
    name: "Magic Mouse 2",
    color: "Black",
    category: "Accessories",
    price: "$99",
  },
  {
    id: "24",
    name: "Apple Watch",
    color: "Silver",
    category: "Accessories",
    price: "$179",
  },
  {
    id: "25",
    name: "iPad",
    color: "Gold",
    category: "Tablet",
    price: "$699",
  },
  {
    id: "26",
    name: 'Apple iMac 27"',
    color: "Silver",
    category: "PC Desktop",
    price: "$3999",
  },
]

const formDataKategori = [
  {
    kategori: "Gerakan Berkumpul",
    subkategori: [
      { id: "bersaf_kumpul", nama: "Bersaf Kumpul" },
      { id: "sikap_sempurna", nama: "Sikap Sempurna" },
      { id: "sikap_hormat", nama: "Sikap Hormat" },
      { id: "hitung", nama: "Hitung" },
      { id: "istirahat_ditempat", nama: "Istirahat Ditempat" },
      { id: "periksa_kerapihan", nama: "Periksa Kerapihan" },
    ],
  },
  {
    kategori: "Gerakan Berjalan",
    subkategori: [
      { id: "langkah_tegap", nama: "Langkah Tegap" },
      { id: "langkah_biasa", nama: "Langkah Biasa" },
    ],
  },
]

type FormValues = {
  juriId: string
  penilaian: {
    [subkategoriId: string]: {
      lewat?: string
      kurang_1?: string
      kurang_2?: string
      kurang_3?: string
      cukup_1?: string
      cukup_2?: string
      cukup_3?: string
      baik_1?: string
      baik_2?: string
      baik_3?: string
      sangat_baik_1?: string
      sangat_baik_2?: string
      sangat_baik_3?: string
    }
  }
}

export default function Page() {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      juriId: "",
      penilaian: {},
    },
  })

  // --- 4. Submit Handler ---
  const onSubmit = (data: FormValues) => {
    // Di sini Anda menyambungkannya ke API Backend
    console.log("Data Disubmit:", data)
    alert("Data berhasil disimpan! (Cek console log)")
  }
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Daftar Tim */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Tim Garuda Nusantara
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-2">
              SDN 1 Jakarta
              <Badge variant="outline">Kategori: SD</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pilih Juri */}
            <InfoSection>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-dark-blue">
                  Pilih Juri yang Melakukan Penilaian:
                </Label>
                <Select>
                  <SelectTrigger className="h-10 w-full px-3 text-sm sm:h-11">
                    <SelectValue placeholder="Pilih Juri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Juri</SelectLabel>
                      <SelectItem value="sd">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="smp">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="sma">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="purna">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="umum">Budi Santoso, S.Pd</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </InfoSection>
            <InfoSection title="Form Penilaian">
              <div className="flex w-full flex-col-reverse gap-3 rounded-t-xl bg-white p-4 sm:flex-row sm:justify-end sm:p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="h-12 w-full rounded-full bg-stone-200 font-semibold text-neutral-600 hover:bg-stone-300 sm:w-40"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-red-400 font-bold text-white hover:bg-red-500 sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Penilaian
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {/* Komponen Tabel (Responsive Scroll) */}
                <div className="w-full overflow-hidden rounded-xl border border-stone-300 bg-white">
                  <div className="overflow-x-auto">
                    {/* Min-width memaksakan tabel tidak tergencet di layar kecil */}
                    <Table className="min-w-300 border-collapse text-center">
                      <TableHeader>
                        <TableRow className="bg-gray-200 hover:bg-gray-200">
                          <TableHead
                            rowSpan={2}
                            className="w-45 border border-stone-300 text-center align-middle text-base font-semibold text-neutral-700"
                          >
                            Kategori
                          </TableHead>
                          <TableHead
                            rowSpan={2}
                            className="w-50 border border-stone-300 text-center align-middle text-base font-semibold text-neutral-700"
                          >
                            Subkategori
                          </TableHead>
                          <TableHead
                            colSpan={13}
                            className="border border-stone-300 bg-gray-200 text-center text-base font-semibold text-neutral-700"
                          >
                            Penilaian
                          </TableHead>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="h-12 w-15 border border-stone-300 bg-stone-300 text-center text-base font-semibold text-neutral-700">
                            Lewat
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="h-12 w-45 border border-stone-300 bg-red-400 text-center text-base font-semibold text-white"
                          >
                            Kurang
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="h-12 w-45 border border-stone-300 bg-amber-300 text-center text-base font-semibold text-neutral-700"
                          >
                            Cukup
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="h-12 w-45 border border-stone-300 bg-green-500 text-center text-base font-semibold text-white"
                          >
                            Baik
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="h-12 w-45 border border-stone-300 bg-blue-500 text-center text-base font-semibold text-white"
                          >
                            Sangat Baik
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formDataKategori.map((grup) =>
                          grup.subkategori.map((sub, subIndex) => (
                            <TableRow
                              key={sub.id}
                              className="bg-white hover:bg-neutral-50/50"
                            >
                              {/* Kolom Kategori (rowSpan) */}
                              {subIndex === 0 && (
                                <TableCell
                                  rowSpan={grup.subkategori.length}
                                  className="border border-stone-300 bg-gray-50 p-4 text-left align-top font-semibold text-neutral-700"
                                >
                                  {grup.kategori}
                                </TableCell>
                              )}

                              {/* Kolom Subkategori */}
                              <TableCell className="border border-stone-300 p-4 text-left font-normal text-neutral-700">
                                {sub.nama}
                              </TableCell>

                              {/* Kolom Input Nilai - Menggunakan Helper Function agar DRY */}
                              <InputCell
                                name={`penilaian.${sub.id}.lewat`}
                                placeholder="-"
                                register={register}
                              />

                              <InputCell
                                name={`penilaian.${sub.id}.kurang_1`}
                                placeholder="6"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.kurang_2`}
                                placeholder="7"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.kurang_3`}
                                placeholder="8"
                                register={register}
                              />

                              <InputCell
                                name={`penilaian.${sub.id}.cukup_1`}
                                placeholder="9"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.cukup_2`}
                                placeholder="10"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.cukup_3`}
                                placeholder="11"
                                register={register}
                              />

                              <InputCell
                                name={`penilaian.${sub.id}.baik_1`}
                                placeholder="12"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.baik_2`}
                                placeholder="13"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.baik_3`}
                                placeholder="14"
                                register={register}
                              />

                              <InputCell
                                name={`penilaian.${sub.id}.sangat_baik_1`}
                                placeholder="15"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.sangat_baik_2`}
                                placeholder="16"
                                register={register}
                              />
                              <InputCell
                                name={`penilaian.${sub.id}.sangat_baik_3`}
                                placeholder="17"
                                register={register}
                              />
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-50 bg-white p-6 shadow-sm">
                  <span className="text-base font-semibold text-neutral-700">
                    Keterangan Penilaian:
                  </span>
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded border border-stone-300 bg-stone-300" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-700">
                          Lewat
                        </span>
                        <span className="text-xs text-neutral-500">
                          Tidak Dinilai
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded border border-red-500 bg-red-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-700">
                          Kurang
                        </span>
                        <span className="text-xs text-neutral-500">
                          Nilai 10, 12, 13
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded border border-amber-400 bg-amber-300" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-700">
                          Cukup
                        </span>
                        <span className="text-xs text-neutral-500">
                          Nilai 14, 15, 16
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded border border-green-600 bg-green-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-700">
                          Baik
                        </span>
                        <span className="text-xs text-neutral-500">
                          Nilai 17, 18, 19
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded border border-blue-600 bg-blue-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-700">
                          Sangat Baik
                        </span>
                        <span className="text-xs text-neutral-500">
                          Nilai 20, 21, 22
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </InfoSection>
            <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-rose-50 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Pelanggaran Tim
                </span>
                <span className="text-2xl font-semibold text-slate-900">0</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {/* Item Pelanggaran */}
                <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 sm:w-auto sm:min-w-[280px]">
                  <Checkbox />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-normal text-neutral-500">
                      Tidak Seragam
                    </span>
                    <span className="text-xs font-normal text-red-500">
                      -5 poin
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 sm:w-auto sm:min-w-[280px]">
                  <Checkbox />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-normal text-neutral-500">
                      Keluar dari Formasi
                    </span>
                    <span className="text-xs font-normal text-red-500">
                      -3 poin
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 sm:w-auto sm:min-w-[280px]">
                  <Checkbox />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-normal text-neutral-500">
                      Tidak Kompak
                    </span>
                    <span className="text-xs font-normal text-red-500">
                      -2 poin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoSection({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-4 shadow-sm sm:p-6">
      {title && (
        <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      )}
      {children}
    </div>
  )
}

function InputCell({
  name,
  placeholder,
  register,
}: {
  name: any
  placeholder: string
  register: any
}) {
  return (
    <TableCell className="border border-stone-300 p-0 align-middle">
      <input
        type="text"
        placeholder={placeholder}
        {...register(name)}
        className="flex h-12 w-[60px] bg-transparent text-center text-sm font-medium text-neutral-700 transition-colors outline-none placeholder:text-neutral-400 focus:bg-sky-50 focus:ring-2 focus:ring-sky-500 focus:ring-inset"
      />
    </TableCell>
  )
}
