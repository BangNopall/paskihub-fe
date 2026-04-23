import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
          <Card className="@container/card border-none bg-glassmorphism-50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-xl font-bold text-dark-blue">
                My Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <InfoSection title="Info Dasar">test</InfoSection>
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
