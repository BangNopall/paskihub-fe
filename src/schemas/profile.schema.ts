import { z } from "zod";

export const eoDataFormSchema = z.object({
  name: z.string().min(3, "Nama event wajib diisi"),
  organizer: z.string().min(3, "Nama sekolah/instansi wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  address: z.string().min(3, "Alamat wajib diisi"),
  nama_pj: z.string().min(3, "Nama penanggung jawab wajib diisi"),
  no_wa_pj: z.string().min(10, "Nomor Whatsapp tidak valid"),
  bank_name: z.string().min(2, "Nama bank wajib diisi"),
  bank_number: z.string().min(5, "Nomor rekening wajib diisi"),
  open_date: z.string().min(1, "Tanggal pendaftaran dibuka wajib diisi"),
  close_date: z.string().min(1, "Tanggal pendaftaran ditutup wajib diisi"),
});

export const pesertaDataFormSchema = z.object({
  name: z.string().min(3, "Nama instansi wajib diisi"),
  address: z.string().min(3, "Alamat wajib diisi"),
  institution_type: z.string().min(1, "Tingkat wajib diisi"),
  name_pj: z.string().min(3, "Nama PIC wajib diisi"),
  no_wa_pj: z.string().min(10, "Nomor Whatsapp tidak valid"),
});

export const eoUpdatePasswordSchema = z.object({
  old_password: z.string().min(8, "Password lama minimal 8 karakter"),
  new_password: z.string().min(8, "Password baru minimal 8 karakter"),
  confirm_password: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirm_password"],
});

export const eoStaffCreateSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirm_password: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirm_password"],
});

export const eoStaffResetPasswordSchema = z.object({
  password: z.string().min(8, "Password baru minimal 8 karakter"),
  confirm_password: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirm_password"],
});

export type EODataFormData = z.infer<typeof eoDataFormSchema>;
export type PesertaDataFormData = z.infer<typeof pesertaDataFormSchema>;
export type EOUpdatePasswordData = z.infer<typeof eoUpdatePasswordSchema>;
export type EOStaffCreateData = z.infer<typeof eoStaffCreateSchema>;
export type EOStaffResetPasswordData = z.infer<typeof eoStaffResetPasswordSchema>;

