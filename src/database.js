import { MONGODB_URI } from "./config";
import mongoose from "mongoose";

mongoose
  .connect(MONGODB_URI)
  .then((db) => console.log("Db is connected"))
  .catch((error) => console.log(error));
