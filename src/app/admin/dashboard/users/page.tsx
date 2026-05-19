import React from "react"
import { UserManagementClient } from "@/components/admin/user-management-client"
import { adminService } from "@/services/admin.service"
import { AlertCircle } from "lucide-react"
import { UserResponse } from "@/schemas/admin.schema"

export default async function UserManagementPage() {
  let users: UserResponse[] = []
  let isError = false

  try {
    users = await adminService.fetchAdminUsers()
  } catch (error) {
    console.error("Gagal memuat data user:", error)
    isError = true
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data User
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          Terjadi kesalahan saat mengambil data dari server.
        </p>
      </div>
    )
  }

  return <UserManagementClient initialUsers={users} />
}
