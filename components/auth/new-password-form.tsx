"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { newPassword } from "@/actions/new-password"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormWarning } from "@/components/form-warning"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NewPasswordSchema } from "@/schemas"
import { FormSuccess } from "../form-success"

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [warning, setWarning] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("")
    setWarning("")
    setSuccess("")

    console.log(values)

    startTransition(() => {
      newPassword(values, token).then((response: { error?: string; warning?: string; success?: string }) => {
        console.log(response)

        setSuccess(response.success)
        setError(response.error)
        setWarning(response.warning)
      })
    })
  }

  return (
    <CardWrapper headerLabel="Enter a new password" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormWarning message={warning} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
