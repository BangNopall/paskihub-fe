import { Card, Label } from "flowbite-react";
import { Button, Checkbox, TextInput } from "@/components/ui/design-system";
import { Montserrat } from "@/libs/fonts";
import Link from "next/link";

export default function Login() {
    return (
        <div className="container mx-auto h-screen w-full overflow-x-hidden px-6 sm:px-10 lg:px-12">
            <div className="flex h-full w-full flex-col items-center justify-center">
                <Card className="w-full max-w-xl rounded-3xl p-12 transition-all duration-300 ease-in-out bg-glassmorphism-50 backdrop-blur-xl">
                    <div
                        className={`text-dark-blue text-3xl font-bold ${Montserrat.className} text-center`}
                    >
                        Masuk Ke PaskiHub
                    </div>
                    <form className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1">Email</Label>
                            </div>
                            <TextInput
                                id="email1"
                                type="email"
                                placeholder="name@gmail.com"
                                required
                                className="max-w-full"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password1">Password</Label>
                            </div>
                            <TextInput
                                id="password1"
                                type="password"
                                required
                                className="max-w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember"
                                />
                                <Label htmlFor="remember">Ingat Saya</Label>
                            </div>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-neutral-400 transition-colors duration-300 ease-in-out hover:text-neutral-500"
                            >
                                Lupa Password?
                            </Link>
                        </div>
                        <Button type="submit">Masuk</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
