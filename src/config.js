import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 4100;

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://Localhost/test";

export const SECRET = process.env.SECRET;
