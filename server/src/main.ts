import express from "express";
import { PORT } from "./config/env";
import { db } from "./config/db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
