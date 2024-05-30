import * as z from "zod";

export const UserValidation = z
  .object({
    name: z.string().min(4, { message: "Minimun 4 characters" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password minimun length is 8." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password minimun length is 8." }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export const LoginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password minimun length is 8." }),
});

export const UpdateUserValidation = z.object({
  name: z.string().min(4, { message: "Minimun 4 characters" }),
  image: z.string(),
});
