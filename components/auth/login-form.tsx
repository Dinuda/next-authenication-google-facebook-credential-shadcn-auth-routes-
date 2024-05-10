"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { login } from "@/actions/login"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { FormWarning } from "@/components/form-warning"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginSchema } from "@/schemas"

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinkedError"
      ? "Email already is use with different provider."
      : undefined

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [warning, setWarning] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setWarning("")

    startTransition(() => {
      login(values).then((response: { error?: string; warning?: string; success?: string }) => {
        console.log(response)

        setSuccess(response.success)
        setError(response.error)
        setWarning(response.warning)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type="password" placeholder="******" />
                  </FormControl>
                  <Button size="sm" variant="link" asChild className="px-0 font-normal">
                    <Link href="/auth/reset">Forgot password</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormWarning message={warning} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
