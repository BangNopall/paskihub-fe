"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface WalletTransactionTableProps {
  transactions: any[]
}

function TransactionBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase()
  switch (normalizedStatus) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-yellow-400 bg-yellow-50 px-3 py-1 font-poppins text-xs font-normal text-yellow-600"
        >
          Pending
        </Badge>
      )
    case "approved":
    case "success":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-green-400 bg-emerald-50 px-3 py-1 font-poppins text-xs font-normal text-green-600"
        >
          Approved
        </Badge>
      )
    case "pengurangan":
    case "rejected":
    case "failed":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-red-300 bg-red-50 px-3 py-1 font-poppins text-xs font-normal text-red-400"
        >
          {status}
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-stone-300 bg-gray-50 px-3 py-1 text-stone-400"
        >
          {status}
        </Badge>
      )
  }
}

export function WalletTransactionTable({
  transactions,
}: WalletTransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-blue-50/50">
              <TableRow className="border-sky-100 hover:bg-transparent">
                <TableHead className="w-16 py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                  No
                </TableHead>
                <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                  Jenis Transaksi
                </TableHead>
                <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                  Tanggal
                </TableHead>
                <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                  Jumlah Koin
                </TableHead>
                <TableHead className="py-4 text-center font-poppins text-sm font-normal text-neutral-700">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-neutral-500"
                  >
                    Belum ada riwayat transaksi.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((tx: any, index: number) => {
                  const actualIndex =
                    (currentPage - 1) * itemsPerPage + index + 1
                  return (
                    <TableRow
                      key={tx.id}
                      className="border-sky-100 hover:bg-white/50"
                    >
                      <TableCell className="py-4 text-center">
                        {actualIndex}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        {tx.type || tx.transaction_type}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "py-4 text-center font-semibold",
                          tx.amount > 0 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {tx.amount > 0
                          ? `+ ${tx.amount}`
                          : `- ${Math.abs(tx.amount)}`}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <TransactionBadge status={tx.status} />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-poppins text-sm text-neutral-500">
            Menampilkan{" "}
            {Math.min(
              itemsPerPage,
              transactions.length - (currentPage - 1) * itemsPerPage
            )}{" "}
            dari {transactions.length} transaksi
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1)
                  }}
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
