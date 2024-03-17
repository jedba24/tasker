import express from "express";
import { PORT } from "./config/env.config";
import { db } from "./config/db.config";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRouter } from "./auth/auth.routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use(errorMiddleware);
const main = async () => {
  try {
    await db.$connect();
    app.listen(PORT, () => console.log(`Server Running On: ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
