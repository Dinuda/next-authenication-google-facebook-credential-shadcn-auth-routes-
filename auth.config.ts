import Facebook from "@auth/core/providers/facebook"
import Google from "@auth/core/providers/google"
import { User } from "@prisma/client"
import bcryptjs from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { getUserByEmail } from "@/data/user"
import { env } from "@/env.mjs"
import { LoginSchema } from "@/schemas"

export default {
  providers: [
    Credentials({
      async authorize(credentails) {
        const validatedFields = LoginSchema.safeParse(credentails)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = (await getUserByEmail(email)) as User
          if (!user || !user.password) return null

          const passwordsMatched = await bcryptjs.compare(password, user.password)

          if (passwordsMatched) return user
        }

        return null
      },
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig
