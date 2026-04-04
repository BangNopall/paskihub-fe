"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"

// import Logo from '@/components/shadcn-studio/logo'
// import AuthBackgroundShape from '@/assets/svg/auth-background-shape'
// import LoginForm from "@/components/shadcn-studio/blocks/login-page-01/login-form"

const Login = () => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md sm:max-w-2xl p-16 bg-glassmorphism-50">
        <CardHeader className="gap-6">
          <div>
            <CardTitle className={`${Montserrat.className} mb-1.5 text-3xl text-center font-bold text-dark-blue`}>
              Masuk ke PaskiHub
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Login Form */}
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="userEmail" className="leading-5">
                  Email address*
                </Label>
                <Input
                  type="email"
                  id="userEmail"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password */}
              <div className="w-full space-y-1">
                <Label htmlFor="password" className="leading-5">
                  Password*
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    className="pr-9"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className="absolute inset-y-0 right-0 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
                  >
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className="sr-only">
                      {isVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between gap-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox id="rememberMe" className="size-6" />
                  <Label htmlFor="rememberMe" className="text-muted-foreground">
                    {" "}
                    Remember Me
                  </Label>
                </div>

                <a href="#" className="hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button className="w-full" type="submit">
                Sign in to Shadcn Studio
              </Button>
            </form>

            <p className="text-center text-muted-foreground">
              New on our platform?{" "}
              <a href="#" className="text-card-foreground hover:underline">
                Create an account
              </a>
            </p>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p>or</p>
              <Separator className="flex-1" />
            </div>

            <Button variant="ghost" className="w-full" asChild>
              <a href="#">Sign in with google</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
