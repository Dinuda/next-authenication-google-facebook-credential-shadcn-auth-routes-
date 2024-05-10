"use client"

import { signIn } from "next-auth/react"
import { FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const Social = () => {
  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      callBackUrl: DEFAULT_LOGIN_REDIRECT,
    })
  }
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button size="lg" variant="outline" className="w-full" onClick={() => onClick("google")}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button size="lg" variant="outline" className="w-full" onClick={() => onClick("facebook")}>
        <FaFacebook className="h-5 w-5" />
      </Button>
    </div>
  )
}
