"use server"

import { User } from "@prisma/client"
import bcrypt from "bcryptjs"
import * as z from "zod"
import { getUserByEmail } from "@/data/user"
import { deleteVerificationTokenByTokenAndEmail, getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"
import { NewPasswordSchema } from "@/schemas"

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
  if (!token) {
    return { error: "Invalid token" }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.message }
  }

  const { password } = validatedFields.data

  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: "Invalid token" }
  }

  const hasExpired = new Date(existingToken.expires).getTime() < new Date().getTime()

  if (hasExpired) {
    return { error: "Token has expired" }
  }

  // Get user by email
  const existingUser = (await getUserByEmail(existingToken.identifier)) as User

  if (!existingUser) {
    return { error: "Email does not exists!" }
  }

  if (values.password !== values.confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: {
      email: existingUser.email,
    },
    data: {
      password: hashedPassword,
    },
  })

  await deleteVerificationTokenByTokenAndEmail(token, existingToken.identifier)

  return { success: "Password updated!" }
}
