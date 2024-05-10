"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"

import { newVerification } from "@/actions/new-verification"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return
    }

    if (!token) {
      setError("Token not found!")
      return
    }

    await newVerification(token)
      .then((response) => {
        setSuccess(response.success)
        setError(response.error)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper headerLabel="Confirming your email" backButtonHref="/auth/login" backButtonLabel="Back to login">
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}
        <FormError message={error} />
        {success && <FormSuccess message={success} />}
      </div>
    </CardWrapper>
  )
}

export default NewVerificationForm
