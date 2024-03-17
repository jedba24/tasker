import { NODE_ENV } from "./env.config";

export const cookieConfig = {
  httpOnly: true,
  secure: NODE_ENV === "production",
};
