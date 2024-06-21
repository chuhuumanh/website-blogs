import {z} from "zod"

export const createLoginSchema = z.object({
    username: z.string(),
    password: z.string()
})
.required()

export type createLoginDto = z.infer<typeof createLoginSchema>;