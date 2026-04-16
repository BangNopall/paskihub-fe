import { Search, Filter, ChevronDown, Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DetailRowProps {
  label: string
  value?: string
  valueNode?: React.ReactNode
  className?: string
}

const products = [
  {
    id: "21",
    name: "Tim1",
    color: "Silver",
    category: "Laptop",
    price: "$2999",
  },
  {
    id: "22",
    name: "Microsoft Surface Pro",
    color: "White",
    category: "Laptop PC",
    price: "$1999",
  },
  {
    id: "23",
    name: "Magic Mouse 2",
    color: "Black",
    category: "Accessories",
    price: "$99",
  },
  {
    id: "24",
    name: "Apple Watch",
    color: "Silver",
    category: "Accessories",
    price: "$179",
  },
  {
    id: "25",
    name: "iPad",
    color: "Gold",
    category: "Tablet",
    price: "$699",
  },
  {
    id: "26",
    name: 'Apple iMac 27"',
    color: "Silver",
    category: "PC Desktop",
    price: "$3999",
  },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Daftar Tim */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Tim Garuda Nusantara
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-2">
              SDN 1 Jakarta
              <Badge variant="outline">Kategori: SD</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pilih Juri */}
            <InfoSection>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-dark-blue">
                  Pilih Juri yang Melakukan Penilaian:
                </Label>
                <Select>
                  <SelectTrigger className="h-10 w-full px-3 text-sm sm:h-11">
                    <SelectValue placeholder="Pilih Juri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Juri</SelectLabel>
                      <SelectItem value="sd">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="smp">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="sma">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="purna">Budi Santoso, S.Pd</SelectItem>
                      <SelectItem value="umum">Budi Santoso, S.Pd</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </InfoSection>
            <InfoSection>
              <div></div>
            </InfoSection>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoSection({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-4 shadow-sm sm:p-6">
      {title && (
        <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      )}
      {children}
    </div>
  )
}

function DetailRow({ label, value, valueNode, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className
      )}
    >
      <span className="text-base leading-6 font-normal text-neutral-500">
        {label}
      </span>
      {valueNode ? (
        valueNode
      ) : (
        <span className="max-w-[60%] flex-wrap text-right text-base leading-6 font-medium text-neutral-700">
          {value}
        </span>
      )}
    </div>
  )
}
