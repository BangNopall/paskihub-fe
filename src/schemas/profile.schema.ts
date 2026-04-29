import { z } from "zod";

export const eoDataFormSchema = z.object({
  name: z.string().min(3, "Nama event wajib diisi"),
  event_level_id: z.string().optional(), // Based on the payload if required
  address: z.string().min(3, "Lokasi wajib diisi"),
  level: z.string().min(1, "Tingkat wajib diisi"),
  schoolName: z.string().min(3, "Nama sekolah/instansi wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  picName: z.string().min(3, "Nama PIC wajib diisi"),
  whatsapp: z.string().min(10, "Nomor Whatsapp tidak valid"),
  bankName: z.string().min(2, "Nama bank wajib diisi"),
  bankNumber: z.string().min(5, "Nomor rekening wajib diisi"),
});

export const pesertaDataFormSchema = z.object({
  instansiName: z.string().min(3, "Nama instansi wajib diisi"),
  address: z.string().min(3, "Alamat wajib diisi"),
  level: z.string().min(1, "Tingkat wajib diisi"),
  picName: z.string().min(3, "Nama PIC wajib diisi"),
  picWhatsapp: z.string().min(10, "Nomor Whatsapp tidak valid"),
});

export type EODataFormData = z.infer<typeof eoDataFormSchema>;
export type PesertaDataFormData = z.infer<typeof pesertaDataFormSchema>;
