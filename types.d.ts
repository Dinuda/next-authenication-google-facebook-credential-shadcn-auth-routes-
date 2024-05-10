// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { UserRole } from "@prisma/client"
import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  isTwoFactorEnabled: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
