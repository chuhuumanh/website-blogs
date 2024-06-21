import { first } from "rxjs";
import {number, z} from "zod"

export const createSignUpSchema = z.object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNum: z.string(),
    email: z.string(),
    gender: z.boolean(),
    role: z.object({
        id: z.number(),
        name: z.string()
    }),
})
.required()

export type createSignUpDto = z.infer<typeof createSignUpSchema>;