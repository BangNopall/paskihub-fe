import TransactionManagementClient from "@/components/admin/transaction-management-client"
import { adminService } from "@/services/admin.service"
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
  const status = typeof params.status === "string" ? params.status : undefined
  const page = typeof params.page === "string" ? parseInt(params.page) : 1
  const limit = typeof params.limit === "string" ? parseInt(params.limit) : 10

  const initialData = await adminService.fetchTransactions(status, page, limit)
  console.log(initialData)

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
