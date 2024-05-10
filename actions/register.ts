"use server"

import bcryptjs from "bcryptjs"
import * as z from "zod"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { RegisterSchema } from "@/schemas"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
      return { warning: "Invalid fields!" }
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcryptjs.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return { warning: "User already exists!" }
    }

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    const verificationToken = await generateVerificationToken(email)
    console.log(verificationToken)

    //TODO: send verification email
    sendVerificationEmail(email, verificationToken.token)

    return { success: "Confirmation email sent!" }
  } catch (error) {
    return { error: "Something went wrong!" }
  }
}
