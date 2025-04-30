import { z } from 'zod'

export const logSchema = z.object({
    logEntry: z.string().min(1, {message: "Log entry cannot be empty"})
})