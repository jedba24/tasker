import z from "zod";

export const userBase = z.object({
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  email: z.string().email().max(50),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,16}$/,
      "One Upper, One Lower, One Special !@#$%^&*, One Number, Between 8 and 16 Characters."
    ),
});

export const userRegisterModel = z
  .object({
    body: userBase.extend({
      confirmPassword: z
        .string()
        .regex(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,16}$/,
          "One Upper, One Lower, One Special !@#$%^&*, One Number, Between 8 and 16 Characters."
        ),
    }),
  })
  .refine(
    ({ body: { password, confirmPassword } }) => password === confirmPassword,
    { path: ["body", "confirmPassword"] }
  );

export const userLoginModel = z.object({
  body: userBase.pick({ email: true, password: true }),
});

export type UserRegisterModel = z.infer<typeof userRegisterModel>["body"];
export type UserLoginModel = z.infer<typeof userLoginModel>["body"];
