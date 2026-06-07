"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Admin dashboard error:", error)
  }, [error])

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h2 className="font-montserrat text-xl font-bold text-slate-900">
        Terjadi Kesalahan
      </h2>
      <p className="text-neutral-500">
        Gagal memuat halaman. Silakan coba lagi.
      </p>
      <Button onClick={() => reset()} className="mt-4 rounded-full">
        Muat Ulang
      </Button>
    </div>
  )
}
