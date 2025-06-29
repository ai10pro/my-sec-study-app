import { z } from "zod";
import { userNameSchema, emailSchema, passwordSchema } from "./CommonSchemas";

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
