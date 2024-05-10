import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: " Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: " Email is required",
  }),
})

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: "Minimum of 6 characters is required",
      })
      .max(50, {
        message: "Maximum of 50 characters is allowed",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  })

export const SettingsSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Minimum of 6 characters is required",
    }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // path of error
  })
