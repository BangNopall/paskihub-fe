import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // This is a placeholder. You should implement your own logic here.
                // For example, calling your API:
                // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { ... })
                
                if (credentials?.username === "admin" && credentials?.password === "admin") {
                    return { id: "1", name: "Admin", email: "admin@example.com" };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
};
