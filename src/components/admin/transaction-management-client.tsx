/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useTransition } from "react"
import {
  Search,
  Check,
  X,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  TrendingUp,
  Ban,
  Maximize2,
} from "lucide-react"

import { getProxyFileUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Textarea } from "@/components/ui/textarea"
import { Poppins } from "@/lib/fonts"
import { toast } from "sonner"
import {
  AdminTransaction,
  AdminTransactionListResponse,
} from "@/schemas/admin.schema"
import {
  approveTransactionAction,
  rejectTransactionAction,
} from "@/actions/admin.actions"
import { useRouter, useSearchParams } from "next/navigation"

// ==========================================
// UI HELPER COMPONENTS
// ==========================================

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ status }: { status: AdminTransaction["status"] }) {
  const styles: Record<AdminTransaction["status"], string> = {
    PENDING: "border-yellow-400 bg-yellow-50 text-yellow-600",
    APPROVE: "border-green-400 bg-green-50 text-green-600",
    REJECTED: "border-red-400 bg-red-50 text-red-600",
  }

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status]}`}
    >
      {status === "APPROVE"
        ? "Berhasil"
        : status === "REJECTED"
          ? "Ditolak"
          : status}
    </Badge>
  )
}

interface Props {
  initialData: AdminTransactionListResponse
}

export default function TransactionManagementClient({ initialData }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  const activeTab = searchParams.get("status") || "all"
  const currentPage = parseInt(searchParams.get("page") || "1")

  const handleTabChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val === "all") {
      params.delete("status")
    } else {
      params.set("status", val)
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleApprove = async () => {
    if (!selectedTx) return

    startTransition(async () => {
      const res = await approveTransactionAction(selectedTx.id)
      if (res.success) {
        toast.success(`Transaksi ${selectedTx.id} berhasil disetujui.`)
        setSelectedTx(null)
      } else {
        toast.error(res.message)
      }
    })
  }

  const handleRejectSubmit = async () => {
    if (!selectedTx || !rejectionReason) return

    startTransition(async () => {
      const res = await rejectTransactionAction(selectedTx.id, rejectionReason)
      if (res.success) {
        toast.error(`Transaksi ${selectedTx.id} ditolak.`)
        setIsRejecting(false)
        setSelectedTx(null)
        setRejectionReason("")
      } else {
        toast.error(res.message)
      }
    })
  }

  const filteredTransactions = initialData.transactions.filter((tx) => {
    return (
      tx.eo_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Stats Logic
  const totalCoins = initialData.transactions
    .filter((t) => t.status === "APPROVE")
    .reduce((acc, curr) => acc + curr.amount_koin, 0)

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Transaksi Koin
          </h1>
          <p className="text-sm text-neutral-500">
            Kelola dan verifikasi permintaan top-up saldo koin dari Event
            Organizer.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatMiniCard
            label="Total Transaksi"
            value={`${initialData.total} Transaksi`}
            icon={<Clock className="h-6 w-6" />}
            color="amber"
          />
          <StatMiniCard
            label="Total Koin Terdistribusi"
            value={`${totalCoins.toLocaleString("id-ID")} Koin`}
            icon={<FileText className="h-6 w-6" />}
            color="info"
          />
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-linear-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
            <CardHeader className="bg-white px-5 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full md:w-auto"
                >
                  <TabsList className="rounded-full bg-neutral-100 p-1">
                    <TabsTrigger
                      value="all"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Semua
                    </TabsTrigger>
                    <TabsTrigger
                      value="PENDING"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Pending
                    </TabsTrigger>
                    <TabsTrigger
                      value="APPROVE"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Berhasil
                    </TabsTrigger>
                    <TabsTrigger
                      value="REJECTED"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Ditolak
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    placeholder="Cari ID atau nama EO..."
                    className="rounded-full border-neutral-200 bg-neutral-50 pl-10 focus-visible:ring-info-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                        ID Transaksi
                      </TableHead>
                      <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                        Event Organizer
                      </TableHead>
                      <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                        Jumlah (IDR)
                      </TableHead>
                      <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                        Koin
                      </TableHead>
                      <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                        Status
                      </TableHead>
                      <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                        Waktu
                      </TableHead>
                      <TableHead className="px-6 text-right font-poppins font-semibold text-neutral-600">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-40 text-center font-poppins text-neutral-500"
                        >
                          Tidak ada transaksi ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <TableRow
                          key={tx.id}
                          className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50"
                        >
                          <TableCell className="px-6 py-4 font-mono text-xs font-medium text-neutral-500">
                            {tx.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="px-6 py-4 font-poppins font-semibold text-neutral-800">
                            {tx.eo_name}
                          </TableCell>
                          <TableCell className="px-6 py-4 font-poppins font-medium text-neutral-700">
                            {formatRupiah(tx.amount)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className="bg-info-50 text-info-600 hover:bg-info-100"
                            >
                              {tx.amount_koin} Koin
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <StatusBadge status={tx.status} />
                          </TableCell>
                          <TableCell className="px-6 py-4 text-xs text-neutral-500">
                            {new Date(tx.created_at).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <Dialog
                              onOpenChange={(open) => {
                                if (!open) {
                                  setSelectedTx(null)
                                  setIsRejecting(false)
                                  setRejectionReason("")
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full text-info-600 hover:bg-info-50 hover:text-info-700"
                                  onClick={() => setSelectedTx(tx)}
                                >
                                  <Eye className="mr-2 h-4 w-4" /> Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="overflow-hidden rounded-[32px] border-none p-0 shadow-2xl sm:max-w-[550px]">
                                <DialogHeader className="relative bg-gradient-to-r from-info-600 to-info-500 p-8 text-white">
                                  <DialogTitle className="font-montserrat text-2xl font-bold">
                                    Verifikasi Pembayaran
                                  </DialogTitle>
                                  <DialogDescription className="text-info-50 opacity-90">
                                    ID: {selectedTx?.id} • {selectedTx?.eo_name}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="no-scrollbar grid max-h-[70vh] gap-6 overflow-y-auto p-8">
                                  <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
                                    <div className="flex flex-col">
                                      <span className="mb-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                        Total Nominal
                                      </span>
                                      <span className="text-2xl font-bold text-slate-900">
                                        {formatRupiah(selectedTx?.amount || 0)}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span className="mb-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                        Koin Didapat
                                      </span>
                                      <span className="text-2xl font-bold text-info-600">
                                        {selectedTx?.amount_koin} Koin
                                      </span>
                                    </div>
                                  </div>

                                  {selectedTx?.status === "REJECTED" && (
                                    <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                                      <Ban className="mt-0.5 h-5 w-5 text-red-600" />
                                      <div className="space-y-1">
                                        <p className="text-sm font-bold text-red-700">
                                          Alasan Penolakan:
                                        </p>
                                        <p className="text-sm text-red-600">
                                          {selectedTx.rejection_reason}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-semibold text-neutral-800">
                                        Bukti Transfer
                                      </label>
                                      {selectedTx?.proof_path && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          asChild
                                          className="h-8 rounded-full font-bold text-info-600"
                                        >
                                          <a
                                            href={
                                              getProxyFileUrl(
                                                selectedTx.proof_path
                                              ) || "#"
                                            }
                                            target="_blank"
                                          >
                                            <Download className="mr-2 h-3.5 w-3.5" />{" "}
                                            Download
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                    <div className="group relative flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-100">
                                      {selectedTx?.proof_path ? (
                                        <img
                                          src={
                                            getProxyFileUrl(
                                              selectedTx.proof_path
                                            ) || ""
                                          }
                                          alt="Bukti Transfer"
                                          className="h-full w-full object-contain"
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center gap-2 text-neutral-400 transition-all group-hover:scale-110 group-hover:text-info-500">
                                          <Maximize2 className="h-10 w-10" />
                                          <span className="text-sm font-medium">
                                            Bukti transfer tidak tersedia
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {isRejecting && (
                                    <div className="animate-in space-y-3 fade-in slide-in-from-top-2">
                                      <label className="flex items-center gap-2 text-sm font-semibold text-red-600">
                                        <AlertCircle className="h-4 w-4" />{" "}
                                        Alasan Penolakan
                                      </label>
                                      <Textarea
                                        placeholder="Tulis alasan kenapa transaksi ini ditolak..."
                                        className="min-h-[100px] rounded-xl border-red-200 bg-red-50/10 focus-visible:ring-red-500"
                                        value={rejectionReason}
                                        onChange={(e) =>
                                          setRejectionReason(e.target.value)
                                        }
                                      />
                                    </div>
                                  )}
                                </div>

                                <DialogFooter className="flex flex-col gap-3 p-8 pt-0 sm:flex-row">
                                  {selectedTx?.status === "PENDING" ? (
                                    <>
                                      {!isRejecting ? (
                                        <>
                                          <Button
                                            variant="outline"
                                            className="h-12 flex-1 rounded-full border-red-200 font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => setIsRejecting(true)}
                                            disabled={isPending}
                                          >
                                            <X className="mr-2 h-4 w-4" /> Tolak
                                            Transaksi
                                          </Button>
                                          <Button
                                            className="h-12 flex-1 rounded-full bg-green-600 font-bold text-white shadow-lg hover:bg-green-700"
                                            onClick={handleApprove}
                                            disabled={isPending}
                                          >
                                            {isPending ? (
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                              <Check className="mr-2 h-4 w-4" />
                                            )}
                                            Setujui & Tambah Koin
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <Button
                                            variant="ghost"
                                            className="h-12 flex-1 rounded-full font-bold"
                                            onClick={() =>
                                              setIsRejecting(false)
                                            }
                                            disabled={isPending}
                                          >
                                            Batalkan
                                          </Button>
                                          <Button
                                            className="h-12 flex-1 rounded-full bg-red-600 font-bold text-white shadow-lg hover:bg-red-700"
                                            onClick={handleRejectSubmit}
                                            disabled={
                                              !rejectionReason || isPending
                                            }
                                          >
                                            {isPending ? (
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                              <Ban className="mr-2 h-4 w-4" />
                                            )}
                                            Kirim Penolakan
                                          </Button>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      className="h-12 w-full rounded-full"
                                      disabled
                                    >
                                      Sudah Diproses pada{" "}
                                      {new Date(
                                        selectedTx?.created_at || ""
                                      ).toLocaleDateString("id-ID")}
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            {/* Pagination */}
            {initialData.total > initialData.limit && (
              <div className="border-t border-neutral-100 p-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({
                      length: Math.ceil(initialData.total / initialData.limit),
                    }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(
                              Math.ceil(initialData.total / initialData.limit),
                              currentPage + 1
                            )
                          )
                        }
                        className={
                          currentPage >=
                          Math.ceil(initialData.total / initialData.limit)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatMiniCard({
  label,
  value,
  icon,
  color,
  trend,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: "amber" | "emerald" | "info"
  trend?: string
}) {
  const styles = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    info: "bg-info-50 text-info-600",
  }

  return (
    <Card className="rounded-2xl border-gray-200 bg-white shadow-none transition-all hover:shadow-md">
      <CardContent className="flex h-full w-full items-center gap-4 py-6">
        <div className={`rounded-xl p-3 ${styles[color]}`}>{icon}</div>
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
            {label}
          </span>
          <span className="text-2xl font-bold text-neutral-800">{value}</span>
          {trend && (
            <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" /> {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
