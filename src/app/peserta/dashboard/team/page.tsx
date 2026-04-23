import { Pencil, Plus, Trash, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react"
import { Filter } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

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

export default function TeamPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Data Juri */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Team Saya
            </CardTitle>
            <CardAction>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Buat Tim Baru
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative w-full overflow-hidden rounded-lg">
              <div className="overflow-x-auto rounded-lg border border-neutral-300">
                <Table className="min-w-200 text-left text-sm text-neutral-500">
                  <TableHeader className="bg-neutral-50 text-xs text-neutral-700 uppercase">
                    <TableRow className="border-b border-neutral-200 hover:bg-neutral-50">
                      <TableHead className="w-12 p-4 text-center">No</TableHead>
                      <TableHead className="px-6 py-3 font-semibold">
                        Tim
                      </TableHead>
                      <TableHead className="px-6 py-3 font-semibold">
                        Nama Pelatih
                      </TableHead>
                      <TableHead className="px-6 py-3 font-semibold">
                        Status Pembayaran
                      </TableHead>
                      <TableHead className="px-6 py-3 font-semibold">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className="border-b border-neutral-200 bg-white transition-colors hover:bg-neutral-50"
                      >
                        <TableCell className="p-4 text-center font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="max-w-50 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              width={40}
                              height={40}
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                              src={"https://placehold.co/400"}
                              alt="Tim Avatar"
                              unoptimized
                            />
                            <div className="flex flex-col overflow-hidden">
                              <span className="truncate text-base font-semibold text-neutral-900">
                                Bonnie Green
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-neutral-700">
                          Pak Budi
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className="border-success-200 bg-success-50 text-success-600 hover:bg-success-50">
                            Approval
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* DIALOG DETAIL TIM */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="default" size="sm">
                                  Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                <DialogHeader className="p-6 pb-2">
                                  <DialogTitle className="text-xl font-bold text-dark-blue">
                                    (Nama Tim)
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
                                        Info Umum
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="member"
                                        className="w-1/2"
                                      >
                                        Anggota
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="berkas"
                                        className="w-1/2"
                                      >
                                        Berkas
                                      </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="name" className="pt-2">
                                      
                                    </TabsContent>

                                    <TabsContent value="member" className="pt-2">
                                      
                                    </TabsContent>
                                    <TabsContent value="berkas" className="pt-2">
                                      
                                    </TabsContent>
                                  </Tabs>
                                  <div className="mt-4 flex w-full flex-row items-center justify-center gap-2">
                                    <DialogClose asChild>
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                      >
                                        Tutup
                                      </Button>
                                    </DialogClose>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {/* DIALOG KICK */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                <DialogHeader className="p-6 pb-2">
                                  <DialogTitle className="text-xl font-bold text-dark-blue">
                                    Konfirmasi Hapus Tim
                                  </DialogTitle>
                                  <Separator className="mt-4" />
                                </DialogHeader>
                                <div className="relative w-full px-6 pb-6">
                                  <div className="mb-10 self-stretch text-center text-sm leading-5 font-normal text-neutral-500">
                                    Apakah kamu yakin ingin menghapus tim?
                                    Tindakan ini tidak dapat dibatalkan dan akan
                                    menghapus semua data anggota tim.{" "}
                                    <span className="text-sm leading-5 font-semibold text-danger-500">
                                      Paskibra Elang Jaya
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

function DetailRow({ label, value, valueNode, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className
      )}
    >
      <span className="text-base leading-6 font-normal text-neutral-500">
        {label}
      </span>
      {valueNode ? (
        valueNode
      ) : (
        <span className="max-w-[60%] flex-wrap text-right text-base leading-6 font-medium text-neutral-700">
          {value}
        </span>
      )}
    </div>
  )
}
