"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Filter,
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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Textarea } from "@/components/ui/textarea"
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export type TransactionStatus = "Pending" | "Approved" | "Rejected"

export interface TransactionData {
  id: string
  eo: string
  amount: number
  coins: number
  status: TransactionStatus
  date: string
  time: string
  proof: string
  rejectionReason?: string
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_TRANSACTIONS: TransactionData[] = Array.from({ length: 45 }).map(
  (_, i) => {
    const statuses: TransactionStatus[] = ["Pending", "Approved", "Rejected"]
    const status =
      i < 5 ? "Pending" : statuses[Math.floor(Math.random() * statuses.length)]
    const amount = (Math.floor(Math.random() * 10) + 1) * 100000

    return {
      id: `TX-99${String(i + 1).padStart(2, "0")}`,
      eo: i % 2 === 0 ? "SMA Negeri 1 Jakarta" : "Paskibra Kota Bandung",
      amount: amount,
      coins: amount / 1000,
      status: status,
      date: `${20 + (i % 8)} Apr 2026`,
      time: `${10 + (i % 10)}:${10 + (i % 40)}`,
      proof: "/proof.jpg",
      rejectionReason:
        status === "Rejected"
          ? "Bukti transfer tidak valid atau tidak terbaca."
          : undefined,
    }
  }
)

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    Pending: "border-yellow-400 bg-yellow-50 text-yellow-600",
    Approved: "border-green-400 bg-green-50 text-green-600",
    Rejected: "border-red-400 bg-red-50 text-red-600",
  }

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status]}`}
    >
      {status === "Approved"
        ? "Berhasil"
        : status === "Rejected"
          ? "Ditolak"
          : status}
    </Badge>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function CoinTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [selectedTx, setSelectedTx] = useState<TransactionData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [isProcessingAction, setIsProcessingAction] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/admin/transactions di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setTransactions(MOCK_TRANSACTIONS)
      } catch (error) {
        console.error("Gagal memuat data transaksi:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleApprove = async () => {
    if (!selectedTx) return
    setIsProcessingAction(true)
    try {
      // TODO: Integrasi API Approve
      await new Promise((r) => setTimeout(r, 1000))
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTx.id ? { ...t, status: "Approved" as const } : t
        )
      )
      toast.success(
        `Transaksi ${selectedTx.id} berhasil disetujui. ${selectedTx.coins} koin telah ditambahkan ke saldo ${selectedTx.eo}.`
      )
      setSelectedTx(null)
    } finally {
      setIsProcessingAction(false)
    }
  }

  const handleRejectSubmit = async () => {
    if (!selectedTx || !rejectionReason) return
    setIsProcessingAction(true)
    try {
      // TODO: Integrasi API Reject
      await new Promise((r) => setTimeout(r, 1000))
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTx.id
            ? { ...t, status: "Rejected" as const, rejectionReason }
            : t
        )
      )
      toast.error(
        `Transaksi ${selectedTx.id} ditolak. Alasan: ${rejectionReason}`
      )
      setIsRejecting(false)
      setSelectedTx(null)
      setRejectionReason("")
    } finally {
      setIsProcessingAction(false)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.eo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || tx.status === activeTab
    return matchesSearch && matchesTab
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats Logic
  const pendingCount = transactions.filter((t) => t.status === "Pending").length
  const approvedCount = transactions.filter(
    (t) => t.status === "Approved"
  ).length
  const totalCoins = transactions
    .filter((t) => t.status === "Approved")
    .reduce((acc, curr) => acc + curr.coins, 0)

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Transaksi
        </h2>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Muat Ulang
        </Button>
      </div>
    )
  }

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatMiniCard
            label="Menunggu Approval"
            value={`${pendingCount} Transaksi`}
            icon={<Clock className="h-6 w-6" />}
            color="amber"
          />
          <StatMiniCard
            label="Berhasil"
            value={`${approvedCount} Transaksi`}
            icon={<CheckCircle2 className="h-6 w-6" />}
            color="emerald"
            trend="+15% dari bulan lalu"
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
                  defaultValue="all"
                  onValueChange={(val) => {
                    setActiveTab(val)
                    setCurrentPage(1)
                  }}
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
                      value="Pending"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Pending
                    </TabsTrigger>
                    <TabsTrigger
                      value="Approved"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Berhasil
                    </TabsTrigger>
                    <TabsTrigger
                      value="Rejected"
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
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
                      {paginatedTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-40 text-center font-poppins text-neutral-500"
                          >
                            Tidak ada transaksi ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedTransactions.map((tx) => (
                          <TableRow
                            key={tx.id}
                            className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50"
                          >
                            <TableCell className="px-6 py-4 font-mono text-xs font-medium text-neutral-500">
                              {tx.id}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-poppins font-semibold text-neutral-800">
                              {tx.eo}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-poppins font-medium text-neutral-700">
                              {formatRupiah(tx.amount)}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge
                                variant="secondary"
                                className="bg-info-50 text-info-600 hover:bg-info-100"
                              >
                                {tx.coins} Koin
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <StatusBadge status={tx.status} />
                            </TableCell>
                            <TableCell className="px-6 py-4 text-xs text-neutral-500">
                              <div className="flex flex-col">
                                <span>{tx.date}</span>
                                <span>{tx.time}</span>
                              </div>
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
                                      ID: {selectedTx?.id} • {selectedTx?.eo}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="no-scrollbar grid max-h-[70vh] gap-6 overflow-y-auto p-8">
                                    <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
                                      <div className="flex flex-col">
                                        <span className="mb-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                          Total Nominal
                                        </span>
                                        <span className="text-2xl font-bold text-slate-900">
                                          {formatRupiah(
                                            selectedTx?.amount || 0
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className="mb-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                          Koin Didapat
                                        </span>
                                        <span className="text-2xl font-bold text-info-600">
                                          {selectedTx?.coins} Koin
                                        </span>
                                      </div>
                                    </div>

                                    {selectedTx?.status === "Rejected" && (
                                      <div className="flex items-start gap-3 rounded-xl border border-danger-100 bg-danger-50 p-4">
                                        <Ban className="mt-0.5 h-5 w-5 text-danger-600" />
                                        <div className="space-y-1">
                                          <p className="text-sm font-bold text-danger-700">
                                            Alasan Penolakan:
                                          </p>
                                          <p className="text-sm text-danger-600">
                                            {selectedTx.rejectionReason}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-neutral-800">
                                          Bukti Transfer
                                        </label>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 rounded-full font-bold text-info-600"
                                        >
                                          <Download className="mr-2 h-3.5 w-3.5" />{" "}
                                          Download
                                        </Button>
                                      </div>
                                      <div className="group relative flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-100">
                                        <div className="flex flex-col items-center gap-2 text-neutral-400 transition-all group-hover:scale-110 group-hover:text-info-500">
                                          <Maximize2 className="h-10 w-10" />
                                          <span className="text-sm font-medium">
                                            Klik untuk Perbesar Gambar
                                          </span>
                                        </div>
                                        {/* Real image would go here */}
                                      </div>
                                    </div>

                                    {isRejecting && (
                                      <div className="animate-in space-y-3 fade-in slide-in-from-top-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-danger-600">
                                          <AlertCircle className="h-4 w-4" />{" "}
                                          Alasan Penolakan
                                        </label>
                                        <Textarea
                                          placeholder="Tulis alasan kenapa transaksi ini ditolak..."
                                          className="min-h-[100px] rounded-xl border-danger-200 bg-danger-50/10 focus-visible:ring-danger-500"
                                          value={rejectionReason}
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <DialogFooter className="flex flex-col gap-3 p-8 pt-0 sm:flex-row">
                                    {selectedTx?.status === "Pending" ? (
                                      <>
                                        {!isRejecting ? (
                                          <>
                                            <Button
                                              variant="outline"
                                              className="h-12 flex-1 rounded-full border-danger-200 font-bold text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                                              onClick={() =>
                                                setIsRejecting(true)
                                              }
                                            >
                                              <X className="mr-2 h-4 w-4" />{" "}
                                              Tolak Transaksi
                                            </Button>
                                            <Button
                                              className="h-12 flex-1 rounded-full bg-success-600 font-bold shadow-lg hover:bg-success-700"
                                              onClick={handleApprove}
                                              disabled={isProcessingAction}
                                            >
                                              {isProcessingAction ? (
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
                                            >
                                              Batalkan
                                            </Button>
                                            <Button
                                              className="h-12 flex-1 rounded-full bg-danger-600 font-bold shadow-lg hover:bg-danger-700"
                                              onClick={handleRejectSubmit}
                                              disabled={
                                                !rejectionReason ||
                                                isProcessingAction
                                              }
                                            >
                                              {isProcessingAction ? (
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
                                        Sudah Diproses pada {selectedTx?.date}
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
              )}
            </CardContent>

            {/* Pagination */}
            {!isLoading && filteredTransactions.length > itemsPerPage && (
              <div className="border-t border-neutral-100 p-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
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
      <CardContent className="flex h-full w-full items-center gap-4">
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
