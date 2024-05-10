"use server"

import { UserRole } from "@prisma/client"
import { currentRole } from "@/lib/auth"

export const admin = async () => {
  const role = await currentRole()

  if (role === UserRole.CHILD) {
    return { success: "Welcome Child!" }
  }

  return { error: "You are not authorized to view this page" }
}
