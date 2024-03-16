import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET as string,
    expiresIn: process.env.JWT_ACCESS_EXPIRATION as string,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: process.env.JWT_REFRESH_EXPIRATION as string,
  },
};

export const PORT = parseInt((process.env.PORT as string) || "5000");
