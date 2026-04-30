import { z } from "zod";

export const eoDataFormSchema = z.object({
  name: z.string().min(3, "Nama event wajib diisi"),
  address: z.string().min(3, "Lokasi wajib diisi"),
  organizer: z.string().min(3, "Nama sekolah/instansi wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  nama_pj: z.string().min(3, "Nama PIC wajib diisi"),
  no_wa_pj: z.string().min(10, "Nomor Whatsapp tidak valid"),
  bank_name: z.string().min(2, "Nama bank wajib diisi"),
  bank_number: z.string().min(5, "Nomor rekening wajib diisi"),
  open_date: z.string().min(10, "Tanggal buka tidak valid"),
  close_date: z.string().min(10, "Tanggal tutup tidak valid"),
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
