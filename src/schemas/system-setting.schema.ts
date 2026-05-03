import { z } from "zod"

export const SystemSettingResSchema = z.object({
  coin_rate: z.number(),
  approval_fee: z.number(),
  bank_info: z.object({
    bank_name: z.string(),
    account_number: z.string(),
    account_name: z.string(),
  }),
})

export type SystemSettingRes = z.infer<typeof SystemSettingResSchema>

export const UpdateSystemSettingReqSchema = z.object({
  coin_rate: z.coerce.number().min(1, "Harga koin minimal 1"),
  approval_fee: z.coerce.number().min(0, "Biaya approve minimal 0"),
  bank_name: z.string().min(1, "Nama bank wajib diisi"),
  account_number: z.string().min(1, "Nomor rekening wajib diisi"),
  account_name: z.string().min(1, "Atas nama wajib diisi"),
})

export type UpdateSystemSettingReq = z.infer<
  typeof UpdateSystemSettingReqSchema
>
