import { Pencil, Plus, Trash, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function TeamPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Card Data Tim */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Buat Tim Baru
            </CardTitle>
            <CardAction>
              <Button
                variant="default"
                size="sm"
                className="rounded-md shadow-sm"
              >
                Buat Tim
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-6 pt-6"></CardContent>
        </Card>
      </div>
    </div>
  )
}
