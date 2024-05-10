import { db } from "@/lib/db"

export const getVerificationTokenByEmail = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
      },
    })

    return verificationToken
  } catch (error) {
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
      },
    })

    return verificationToken
  } catch (error) {
    return null
  }
}

export const deleteVerificationTokenByTokenAndEmail = async (token: string, identifier: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        token,
        identifier,
      },
    })

    return true
  } catch (error) {
    return false
  }
}
