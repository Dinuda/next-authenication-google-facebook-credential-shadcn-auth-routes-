"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { reset } from "@/actions/reset"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormWarning } from "@/components/form-warning"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ResetSchema } from "@/schemas"
import { FormSuccess } from "../form-success"

export const ResetForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [warning, setWarning] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("")
    setWarning("")

    console.log(values)

    startTransition(() => {
      reset(values).then((response: { error?: string; warning?: string; success?: string }) => {
        console.log(response)

        setSuccess(response.success)
        setError(response.error)
        setWarning(response.warning)
      })
    })
  }

  return (
    <CardWrapper headerLabel="Forgot your password?" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type="email" placeholder="john.doe@example.com" />
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
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
