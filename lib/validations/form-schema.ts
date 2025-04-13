import * as z from "zod"

export const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "user", "manager"], {
    required_error: "Please select a role.",
  }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
  notifications: z.boolean().default(false),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export const defaultUserFormValues: Partial<UserFormValues> = {
  name: "",
  email: "",
  bio: "",
  notifications: false,
}
