"use server"

import { User } from "@prisma/client"
import * as z from "zod"

import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordTokenByEmail } from "@/lib/tokens"
import { ResetSchema } from "@/schemas"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.message }
  }

  const { email } = validatedFields.data

  const existingUser = (await getUserByEmail(email)) as User

  if (!existingUser) {
    return { error: "Email not found" }
  }

  const token = await generatePasswordTokenByEmail(email)

  await sendPasswordResetEmail(email, token.token)

  return { success: "Password reset link set" }
}
