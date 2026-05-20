import React from "react"
import { adminService } from "@/services/admin.service"
import AdminManagementClient from "@/components/admin/admin-management-client"

export const dynamic = "force-dynamic"

export default async function AdminManagementPage() {
  let admins: any = []
  try {
    admins = await adminService.fetchAdmins()
  } catch (error) {
    console.error("Failed to fetch admins:", error)
  }

  return <AdminManagementClient initialAdmins={admins} />
}
