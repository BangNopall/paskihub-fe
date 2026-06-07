import TransactionManagementClient from "@/components/admin/transaction-management-client"
import { adminService } from "@/services/admin.service"
import { z } from "zod"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Transaksi Koin | Admin Dashboard",
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CoinTransactionsPage({ searchParams }: Props) {
  const params = await searchParams

  const querySchema = z.object({
    page: z.coerce.number().min(1).catch(1),
    limit: z.coerce.number().min(1).max(100).catch(10),
    status: z
      .enum(["PENDING", "APPROVED", "REJECTED"])
      .optional()
      .catch(undefined),
  })

  const { page, limit, status } = querySchema.parse({
    page: params.page,
    limit: params.limit,
    status: params.status,
  })

  const initialData = await adminService.fetchTransactions(status, page, limit)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-info-600" />
        </div>
      }
    >
      <TransactionManagementClient initialData={initialData} />
    </Suspense>
  )
}
