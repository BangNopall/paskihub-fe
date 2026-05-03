"use server"

import { authService } from "@/services/auth.service"
import {
  registerFormSchema,
  RegisterFormData,
  forgotPasswordSchema,
  ForgotPasswordFormData,
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/schemas/auth.schema"

export async function registerAction(
  role: "ORGANIZER" | "PESERTA",
  data: RegisterFormData
) {
  try {
    const parsed = registerFormSchema.parse(data)
    await authService.register(role, parsed)
    return {
      success: true,
      message: "Registrasi berhasil. Silakan cek email Anda.",
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" }
  }
}

export async function forgotPasswordAction(data: ForgotPasswordFormData) {
  try {
    const parsed = forgotPasswordSchema.parse(data)
    await authService.forgotPassword(parsed)
    return {
      success: true,
      message: "Link reset password telah dikirim ke email Anda.",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memproses permintaan",
    }
  }
}

export async function resetPasswordAction(
  token: string,
  data: ResetPasswordFormData
) {
  try {
    const parsed = resetPasswordSchema.parse(data)
    await authService.resetPassword(token, parsed)
    return {
      success: true,
      message: "Password berhasil diubah. Silakan login.",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal mereset password",
    }
  }
}

export async function verifyEmailAction(email: string, token: string) {
  try {
    await authService.verifyEmail(email, token)
    return { success: true, message: "Email berhasil diverifikasi." }
  } catch (error: any) {
    return { success: false, message: error.message || "Verifikasi gagal" }
  }
}
