import {z} from "zod";

export const messageSchema = z.object({
    acceptMessages: z.string().min(10,"Content must be at least of 10 characters.").max(300,"Content must be at most of 300 characters.")
});