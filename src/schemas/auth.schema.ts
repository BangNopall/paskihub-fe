import { z } from "zod";

// Form Validation Schemas
export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerFormSchema = z.object({
  name: z.string().min(3, "Nama lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid").optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Password minimal 8 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

// API Response Schemas
export const baseResponseSchema = z.object({
  message: z.string().optional(),
  status: z.string().optional(),
});

export const loginResponseSchema = z.object({
  data: z.object({
    access_token: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
      name: z.string().optional(),
    }),
  }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
