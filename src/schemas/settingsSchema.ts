import {z} from 'zod'

export const settingsSchema = z.object({
    NotificationType: z.enum(['NoNotification', 'FixedIntervals']),
    SummaryFormat: z.enum(['segmented', 'paragraph'])
})