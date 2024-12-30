import { z } from "zod"

export const apiSchema = z.object({
    proxies: z.array(z.object({
        anonlvl: z.number(),
        type: z.string(),
        ip: z.string(),
        port: z.number()
    })),
    'total_count': z.number()
})