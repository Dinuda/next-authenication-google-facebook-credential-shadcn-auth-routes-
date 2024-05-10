"use server"

import { User, VerificationToken } from "@prisma/client"
import { getUserByEmail } from "@/data/user"
import { deleteVerificationTokenByTokenAndEmail, getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"

export async function newVerification(token: string) {
  const existingToken = (await getVerificationTokenByToken(token)) as VerificationToken
  console.log(existingToken)

  if (!existingToken) {
    return { error: "Token does not exist!" }
  }

  const hasExpired = existingToken?.expires < new Date()

  if (hasExpired) {
    return { error: "Token has expired!" }
  }

  const existingUser = (await getUserByEmail(existingToken?.identifier)) as User

  if (!existingUser) {
    return { error: "User does not exist!" }
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.identifier,
    },
  })

  await deleteVerificationTokenByTokenAndEmail(token, existingToken.identifier)

  return { success: "Email verified!" }
}
