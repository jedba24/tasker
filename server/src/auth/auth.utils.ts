import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/env.config";
import CustomError from "../config/error.config";

export type TokenPayload = {
  id: string;
  role: "USER" | "ADMIN";
};
export type SignTokenPayload = {
  type: "ACCESS" | "REFRESH";
  payload: TokenPayload;
};
export const signToken = ({ type, payload }: SignTokenPayload) => {
  const { secret, expiresIn } =
    jwtConfig[type.toLocaleLowerCase() as keyof typeof jwtConfig];
  return jwt.sign(payload, secret, { expiresIn });
};
export const signUserTokens = (p: TokenPayload) => {
  return {
    accessToken: signToken({ type: "ACCESS", payload: p }),
    refreshToken: signToken({ type: "REFRESH", payload: p }),
  };
};
export const verifyUserToken = async ({
  type,
  payload,
}: SignTokenPayload & { payload: string }): Promise<TokenPayload> => {
  const { secret } =
    jwtConfig[type.toLocaleLowerCase() as keyof typeof jwtConfig];
  return new Promise((res, rej) => {
    jwt.verify(payload, secret, (err, decoded) => {
      if (err) {
        rej(
          new CustomError({
            status: "NOT_AUTHORIZED",
            message: `Invalid ${
              type.charAt(0).toUpperCase() + type.slice(1).toLocaleLowerCase()
            } token`,
          })
        );
      }
      res(decoded as TokenPayload);
    });
  });
};
