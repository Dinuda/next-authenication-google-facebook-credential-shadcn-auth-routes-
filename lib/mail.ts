import * as nodemailer from "nodemailer"
import { env } from "@/env.mjs"
import { ses } from "./aws"

const transporter = nodemailer.createTransport({
  SES: ses,
})

export const sendVerificationEmail = async (email: string, token: string) => {
  console.log(`Sending verification email to ${email} with token ${token}`)
  console.log(env.NEXT_PUBLIC_APP_URL)

  try {
    const response = await transporter
      .sendMail({
        from: env.AWS_SENDER_IDENTITY,
        to: email,
        subject: "Verify your email",
        text: `Click this link to verify your email: ${env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`,
      })
      .catch((error) => {
        console.error("Email error", error)
      })

    return response?.messageId ? { success: "Email sent!" } : { error: "Email failed to send!" }
  } catch (e) {
    console.log(e)
    return { error: "Something went wrong!" }
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`

  try {
    const response = await transporter
      .sendMail({
        from: env.AWS_SENDER_IDENTITY,
        to: email,
        subject: "Reset your password",
        text: `Click this link to reset your password: ${resetUrl}`,
      })
      .catch((error) => {
        console.error("Email error", error)
      })

    return response?.messageId ? { success: "Email sent!" } : { error: "Email failed to send!" }
  } catch (e) {
    console.log(e)
    return { error: "Something went wrong!" }
  }
}
