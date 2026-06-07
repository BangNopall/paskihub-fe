"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { walletService } from "@/services/wallet.service"
import { revalidatePath } from "next/cache"

export async function topUpAction(eventId: string, formData: FormData) {
  try {
    const session: any = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return {
        success: false,
        message: "Sesi telah berakhir. Silakan login kembali.",
      }
    }

    const proof = formData.get("proof") as File | null
    if (proof) {
      if (proof.size > 5 * 1024 * 1024) {
        return { success: false, message: "Ukuran file bukti maksimal 5MB." }
      }
      if (
        !["image/jpeg", "image/png", "application/pdf"].includes(proof.type)
      ) {
        return {
          success: false,
          message: "Format file bukti harus JPG, PNG, atau PDF.",
        }
      }
    }

    await walletService.requestTopUp(session.accessToken, eventId, formData)

    revalidatePath("/organizer/dashboard/wallet")
    return {
      success: true,
      message: "Pengajuan Top Up berhasil dikirim. Menunggu verifikasi admin.",
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("TopUp Error:", error)
    return {
      success: false,
      message: error.message || "Terjadi kesalahan saat mengajukan Top Up.",
    }
  }
}
