import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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

const Pelanggaran = [
  { id: "1", nama: "Tidak Seragam" },
  { id: "2", nama: "Tidak Memakai Topi" },
  { id: "3", nama: "Tidak Memakai Sepatu" },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Data Juri */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Pelanggaran
            </CardTitle>
            <CardAction>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
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
                    <div className="space-y-2">
                      <div className="space-y-2 sm:space-y-1">
                        <Label
                          htmlFor="pelanggaran"
                          className="text-sm text-neutral-500"
                        >
                          Nama pelanggaran
                        </Label>
                        <Input
                          id="pelanggaran"
                          placeholder="Masukkan Nama Pelanggaran"
                        />
                      </div>
                      <div className="mb-10 space-y-2 sm:space-y-1">
                        <Label
                          htmlFor="poin"
                          className="text-sm text-neutral-500"
                        >
                          Poin Pelanggaran
                        </Label>
                        <Input
                          id="poin"
                          placeholder="Masukkan Poin Pelanggaran"
                        />
                        <span className="text-sm text-neutral-300">
                          Poin yang akan dikurangi dari total skor
                        </span>
                      </div>
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
          <CardContent className="space-y-6">
            {/* Data pelanggaran */}
            <div className="relative flex w-full flex-col items-start justify-start gap-4 rounded-lg">
              {Pelanggaran.map((juri) => (
                <Card
                  key={juri.id}
                  className="w-full rounded-2xl border-neutral-50 bg-white shadow-none"
                >
                  <CardContent className="flex w-full items-center justify-between">
                    {/* Nama juri */}
                    <div className="flex flex-col gap-2">
                      <span className="text-base leading-6 font-normal text-neutral-400">
                        {juri.nama}
                      </span>
                      <span className="text-xs leading-6 font-normal text-neutral-300">
                        Pengurangan{" "}
                        <span className="text-danger-300">5 poin</span>
                      </span>
                    </div>

                    {/* Action Buttons (Edit & Delete) */}
                    <div className="flex items-center gap-2">
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
                            <div className="space-y-2">
                              <div className="space-y-2 sm:space-y-1">
                                <Label
                                  htmlFor="pelanggaran"
                                  className="text-sm text-neutral-500"
                                >
                                  Nama pelanggaran
                                </Label>
                                <Input
                                  id="pelanggaran"
                                  placeholder="Masukkan Nama Pelanggaran"
                                />
                              </div>
                              <div className="mb-10 space-y-2 sm:space-y-1">
                                <Label
                                  htmlFor="poin"
                                  className="text-sm text-neutral-500"
                                >
                                  Poin Pelanggaran
                                </Label>
                                <Input
                                  id="poin"
                                  placeholder="Masukkan Poin Pelanggaran"
                                />
                                <span className="text-sm text-neutral-300">
                                  Poin yang akan dikurangi dari total skor
                                </span>
                              </div>
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
                            <div className="mb-10 self-stretch text-center text-sm leading-5 font-normal text-neutral-500">
                              Apakah Anda yakin hapus pelanggaran ini?{" "}
                              <span className="text-sm leading-5 font-semibold text-danger-500">
                                SMPN 1 Malang
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
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Kategori dan Sub Kategori Penilaian
            </CardTitle>
            <CardAction>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
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
                    <div className="mb-10 space-y-2 sm:space-y-1">
                      <Label
                        htmlFor="kategori"
                        className="text-sm text-neutral-500"
                      >
                        Nama Kategori
                      </Label>
                      <Input
                        id="kategori"
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
          <CardContent className="space-y-6">
            
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
