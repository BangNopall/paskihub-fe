import { Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function EventPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
          <Card className="bg-glassmorphism-50 border-none shadow-sm @container/card">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-xl font-bold text-dark-blue">
                Info Dasar Event
              </CardTitle>
              <CardAction>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  <span>Edit Event</span>
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Identitas Event */}
              <InfoSection title="Identitas Event">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem
                    label="Nama Event"
                    value="Lomba Gerak Jalan Nasional 2025"
                    className="md:col-span-1 lg:col-span-1"
                  />
                  <InfoItem label="Penyelenggara" value="SMAN 1 Jakarta" />
                  <InfoItem
                    label="Deskripsi Event"
                    value="Kompetisi gerak jalan tingkat nasional untuk kategori pelajar dan umum. Event ini bertujuan untuk mengembangkan disiplin, kekompakan, dan jiwa patriotisme melalui lomba gerak jalan yang kompetitif dan edukatif."
                    className="md:col-span-2 lg:col-span-3"
                  />
                </div>
              </InfoSection>

              {/* Jadwal dan Lokasi */}
              <InfoSection title="Jadwal dan Lokasi">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label="Buka Pendaftaran" value="1 Juni 2026" />
                  <InfoItem label="Tutup Pendaftaran" value="10 Agustus 2026" />
                  <InfoItem label="Pelaksanaan Lomba" value="18 Agustus 2026" />
                  <InfoItem
                    label="Lokasi"
                    value="Lapangan Merdeka, Jakarta Pusat"
                    className="sm:col-span-2 lg:col-span-3"
                  />
                </div>
              </InfoSection>

              {/* Ketentuan Peserta */}
              <InfoSection title="Ketentuan Peserta">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard value="55" label="Total Kuota Tim" />
                  <StatCard value="10" label="Min. Anggota per Tim" />
                  <StatCard value="25" label="Max. Anggota per Tim" />
                </div>
              </InfoSection>

              {/* Informasi Kontak */}
              <InfoSection title="Informasi Kontak">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem
                    label="WhatsApp Panitia"
                    value="+62 812-3456-7890"
                  />
                  <InfoItem
                    label="Penanggung Jawab"
                    value="Ahmad Fauzi, S.Pd"
                  />
                  <InfoItem
                    label="Grup WhatsApp Peserta"
                    value={
                      <a
                        href="#"
                        className="text-info-500 transition-colors hover:underline"
                      >
                        🔗 Link Grup WhatsApp
                      </a>
                    }
                  />
                </div>
              </InfoSection>

              {/* Pembayaran */}
              <InfoSection title="Pembayaran">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label="Nama Bank" value="BCA" />
                  <InfoItem label="Atas Nama" value="Panitia Lomba GJ 2025" />
                  <InfoItem label="Nomor Rekening" value="1234567890" />
                </div>
              </InfoSection>

              {/* Assets Media */}
              <InfoSection title="Aset Media Event">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-500">Logo Event</span>
                    <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
                      <span className="text-xs text-neutral-400">
                        No Logo
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-500">
                      Poster Event
                    </span>
                    <div className="flex aspect-4/3 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
                      <span className="text-xs text-neutral-400">
                        No Poster
                      </span>
                    </div>
                  </div>
                </div>
              </InfoSection>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      {children}
    </div>
  )
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <div className="text-sm font-semibold text-neutral-700">{value}</div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md">
      <span className="text-2xl font-bold text-neutral-700">{value}</span>
      <span className="text-xs text-center font-medium text-neutral-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
