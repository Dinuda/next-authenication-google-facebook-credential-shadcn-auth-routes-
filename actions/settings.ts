"use server"

import { User } from "next-auth"
import * as z from "zod"

import { getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { SettingsSchema } from "@/schemas"
import { ExtendedUser } from "@/types"

export const settings = async (input: z.infer<typeof SettingsSchema>) => {
  // Ensure the user is authenticated
  const user = (await currentUser()) as ExtendedUser

  if (!user) throw new Error("User not found")

  const dbUser = (await getUserById(user.id as string)) as User

  if (!dbUser) throw new Error("User not found")

  // rm confirmPassword
  const data = Object.fromEntries(Object.entries(input).filter(([key]) => key !== "passwordConfirmation"))

  // Update the user's settings
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...data,
    },
  })

  return { success: "Settings updated" }
}
