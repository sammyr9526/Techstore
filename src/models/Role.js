import { Schema, model } from "mongoose";

export const ROLES = ["user", "admin", "moderator"];

const roleSchema = new Schema(
  { name: String },
  {
    versionKey: false, //delete __v
  }
);

export default model("Role", roleSchema);
