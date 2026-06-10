import { z } from "zod"

// Form Validation Schemas
export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export const registerFormSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string().min(8, "Password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  })
  .refine((data) => /[A-Z]/.test(data.password), {
    message: "Password harus mengandung minimal satu huruf besar",
    path: ["password"],
  })
  .refine((data) => /[a-z]/.test(data.password), {
    message: "Password harus mengandung minimal satu huruf kecil",
    path: ["password"],
  })
  .refine((data) => /[0-9]/.test(data.password), {
    message: "Password harus mengandung minimal satu angka",
    path: ["password"],
  })
  .refine((data) => /[^A-Za-z0-9]/.test(data.password), {
    message: "Password harus mengandung minimal satu karakter khusus",
    path: ["password"],
  })
  .refine((data) => /[A-Z]/.test(data.confirm_password), {
    message: "Password harus mengandung minimal satu huruf besar",
    path: ["confirm_password"],
  })
  .refine((data) => /[a-z]/.test(data.confirm_password), {
    message: "Password harus mengandung minimal satu huruf kecil",
    path: ["confirm_password"],
  })
  .refine((data) => /[0-9]/.test(data.confirm_password), {
    message: "Password harus mengandung minimal satu angka",
    path: ["confirm_password"],
  })
  .refine((data) => /[^A-Za-z0-9]/.test(data.confirm_password), {
    message: "Password harus mengandung minimal satu karakter khusus",
    path: ["confirm_password"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string().min(8, "Password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  })

// API Response Schemas
export const baseResponseSchema = z.object({
  message: z.string().optional(),
  status: z.string().optional(),
})

export const RoleSchema = z.enum(["ADMIN", "ORGANIZER", "PESERTA"])
export type Role = z.infer<typeof RoleSchema>

export const loginResponseSchema = z.object({
  data: z.object({
    id: z.string().optional().or(z.literal("")),
    email: z.string().optional().or(z.literal("")),
    role: RoleSchema,
    parent_id: z.string().optional().nullable().or(z.literal("")),
    token: z.string(),
  }),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
export type RegisterFormData = z.infer<typeof registerFormSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
