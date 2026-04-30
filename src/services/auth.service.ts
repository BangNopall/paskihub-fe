import { 
  RegisterFormData, 
  ForgotPasswordFormData, 
  ResetPasswordFormData 
} from "@/schemas/auth.schema";
import { safeJson } from "@/lib/utils";

const API_URL = process.env.API_BASE_URL || "http://localhost:3010";
const API_KEY = process.env.API_KEY;

export const authService = {
  async register(role: "ORGANIZER" | "PESERTA", data: RegisterFormData) {
    const res = await fetch(`${API_URL}/api/v1/users/register/${role}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY || ""
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await safeJson(res).catch(() => ({}));
      throw new Error(err?.message || "Registration failed");
    }
    return safeJson(res);
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const res = await fetch(`${API_URL}/api/v1/users/forgot-password`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY || ""
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal mengirim email reset password");
    return safeJson(res);
  },

  async resetPassword(token: string, data: ResetPasswordFormData) {
    const res = await fetch(`${API_URL}/api/v1/users/reset-password/${token}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY || ""
      },
      body: JSON.stringify({ password: data.password }),
    });
    if (!res.ok) throw new Error("Gagal mereset password");
    return safeJson(res);
  },

  async verifyEmail(email: string, token: string) {
    const res = await fetch(`${API_URL}/api/v1/users/verify-email/${email}/${token}`, {
      method: "GET",
      headers: { 
        "x-api-key": API_KEY || ""
      },
    });
    if (!res.ok) throw new Error("Verifikasi email gagal");
    return safeJson(res);
  }
};
