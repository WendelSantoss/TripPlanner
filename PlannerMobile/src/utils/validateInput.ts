import { z } from "zod"

function email(email: string) {
  const emailSchema = z.string().email()

  return emailSchema.safeParse(email).success
}

export const validateInput = {  email }
