import { z } from "zod";
import { userNameSchema, emailSchema, passwordSchema } from "./CommonSchemas";

export const loginRequestSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
