"use server"

import { User } from "@prisma/client"
import { AuthError } from "next-auth"
import * as z from "zod"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"

export async function login(
  values: z.infer<typeof LoginSchema>
): Promise<{ error: string } | { warning: string } | { success: string }> {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Something went wrong!" }
  }

  const { email, password } = validatedFields.data

  const existingUser = (await getUserByEmail(email)) as User

  console.log(
    existingUser && !existingUser.password && existingUser.emailVerified
      ? "This account was created with a social login method. Please sign in with the same method."
      : ""
  )

  if (existingUser && !existingUser.password && existingUser.emailVerified) {
    return { warning: "Please use social sign in" }
  }

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" }
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)
    sendVerificationEmail(existingUser.email, verificationToken?.token)

    return { success: "Confirmation email sent!" }
  }

  try {
    await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT })
    return { error: "" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error
  }
}
