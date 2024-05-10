"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { settings } from "@/actions/settings"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SettingsSchema } from "@/schemas"
import { ExtendedUser } from "@/types"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { Button } from "../ui/button"

interface SettingsPageProps {
  user: ExtendedUser
}

export const SettingsForm = ({ user }: SettingsPageProps) => {
  const { update } = useSession()

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((response: { success?: string }) => {
          setSuccess(response.success)
          update()
        })
        .catch((error) => {
          setError(error.message)
        })
    })
  }

  useState(() => {
    setError("")
    setSuccess("")

    if (!user) return
    form.setValue("name", user.name as string)
    form.setValue("email", user.email as string)
    form.setValue("password", "")
    form.setValue("passwordConfirmation", "")
  })

  return (
    <CardWrapper headerLabel="Settings" backButtonLabel="Back to client" backButtonHref="/client" showSocial={false}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="John Doe" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="john.doe@example.com" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Password" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Confirm Password" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
