"use client"

import React, { useState, useRef } from "react"
import { Coins, FileText, UploadCloud, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { topUpAction } from "@/actions/wallet.actions"

interface BankInfo {
  bankName: string
  accountNumber: string
  accountName: string
}

interface WalletTopUpFormProps {
  eventId: string
  bankInfo: BankInfo
  coinRate: number
}

const TOP_UP_OPTIONS = [
  { id: 1, coins: 50 },
  { id: 2, coins: 100 },
  { id: 3, coins: 150 },
  { id: 4, coins: 200 },
]

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function SectionWrapper({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6",
        className
      )}
    >
      {title && (
        <h3 className="font-poppins text-lg font-medium text-slate-900">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export function WalletTopUpForm({ eventId, bankInfo, coinRate }: WalletTopUpFormProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [couponCode, setCouponCode] = useState<string>("")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOptionSelect = (coins: number) => {
    setSelectedOption(coins)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedOption(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > 10 * 1024 * 1024) {
        toast.error("File terlalu besar. Maksimal 5MB.")
        return
      }
      setPaymentProof(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = selectedOption || parseInt(customAmount)

    if (!finalAmount || finalAmount <= 0) {
      toast.error("Pilih atau masukkan jumlah koin yang valid.")
      return
    }
    if (!paymentProof) {
      toast.error("Harap unggah bukti transfer.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("amount", finalAmount.toString())
    if (couponCode) formData.append("coupon_code", couponCode)
    formData.append("proof", paymentProof)

    try {
      const result = await topUpAction(eventId, formData)
      if (result.success) {
        toast.success(result.message)
        setSelectedOption(null)
        setCustomAmount("")
        setCouponCode("")
        setPaymentProof(null)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <SectionWrapper>
        <div className="flex flex-col gap-4">
          <span className="font-poppins text-base text-slate-900">
            Pilih Jumlah Koin
          </span>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TOP_UP_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleOptionSelect(opt.coins)}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border p-4 shadow-sm transition-all",
                  selectedOption === opt.coins
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-gray-100 bg-white hover:border-blue-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-zinc-600" />
                  <span className="font-poppins text-lg font-semibold text-zinc-600">
                    {opt.coins}
                  </span>
                </div>
                <span className="font-poppins text-xs text-neutral-700">
                  {formatRupiah(opt.coins * coinRate)}
                </span>
              </div>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Masukkan jumlah koin sendiri"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="h-12 bg-white text-center font-poppins text-sm shadow-sm md:text-left"
          />
          <div className="mt-2 flex flex-col gap-2">
            <Label className="font-poppins text-sm font-normal text-neutral-700">
              Kode Kupon (Opsional)
            </Label>
            <Input
              placeholder="Masukkan kode kupon jika ada"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="h-12 bg-white font-poppins text-sm"
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Instruksi Transfer">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-50 bg-white p-6 shadow-sm sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="font-poppins text-sm text-neutral-500">Nama Bank</span>
              <span className="font-poppins text-sm font-semibold text-neutral-700">{bankInfo.bankName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-poppins text-sm text-neutral-500">Nomor Rekening</span>
              <span className="font-poppins text-sm font-semibold text-neutral-700">{bankInfo.accountNumber}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-poppins text-sm text-neutral-500">Atas Nama</span>
              <span className="font-poppins text-sm font-semibold text-neutral-700">{bankInfo.accountName}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-poppins text-sm font-semibold text-neutral-700">Ketentuan:</span>
            <ul className="list-disc space-y-1 pl-5 font-poppins text-sm text-neutral-700">
              <li>Transfer sesuai jumlah yang dipilih ke rekening di atas</li>
              <li>Simpan bukti transfer dan upload di bawah ini</li>
              <li>Tunggu approval dari admin (maks 1x24 jam)</li>
            </ul>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Upload Bukti Transfer">
        <div className="flex flex-col gap-6">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept=".jpg,.png,.jpeg,.pdf"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-gray-300 bg-neutral-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50 md:p-12"
          >
            {paymentProof ? (
              <>
                <FileText className="h-12 w-12 text-blue-600" />
                <p className="font-poppins text-sm font-semibold text-neutral-800">{paymentProof.name}</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-neutral-500 group-hover:text-blue-500" />
                <span className="font-montserrat text-sm text-neutral-700">Klik untuk unggah bukti transfer</span>
              </>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || (!selectedOption && !customAmount) || !paymentProof}
            className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Ajukan Top Up"}
          </Button>
        </div>
      </SectionWrapper>
    </form>
  )
}
