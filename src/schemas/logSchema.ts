import { z } from 'zod'

export const logSchema = z.object({
    logEntry: z.string().min(10, {message: "Please provide a detailed log entry with at least 10 characters."})
})