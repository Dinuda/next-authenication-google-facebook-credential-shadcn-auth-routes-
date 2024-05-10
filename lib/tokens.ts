import { v4 as uuidv4 } from "uuid"
import { getVerificationTokenByEmail } from "@/data/verification-token"
import { db } from "@/lib/db"

export const generateVerificationToken = async (identifier: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

  const existingToken = await getVerificationTokenByEmail(identifier)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        token: existingToken.token,
      },
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      expires,
      identifier,
    },
  })

  return verificationToken
}

export const generatePasswordTokenByEmail = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        token: existingToken.token,
      },
    })
  }

  const passwordResetToken = await db.verificationToken.create({
    data: {
      token,
      expires,
      identifier: email,
    },
  })

  return passwordResetToken
}
