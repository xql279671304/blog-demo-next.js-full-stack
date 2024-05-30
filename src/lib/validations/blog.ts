import * as z from "zod";

export const BlogValidation = z.object({
  name: z.string().min(4, { message: "Minimun 4 characters" }),
  image: z.string(),
  brief: z.string(),
  content: z.string(),
});
