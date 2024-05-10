import { PrismaAdapter } from "@auth/prisma-adapter"
import { User, UserRole } from "@prisma/client"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"

import { db } from "@/lib/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider !== "credentials") return true

      const existingUser = (await getUserById(user.id)) as User

      if (!existingUser?.emailVerified) return false

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const existingUser = (await getUserById(token.sub)) as User

      if (!existingUser) return token

      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
