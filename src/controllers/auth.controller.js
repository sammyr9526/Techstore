import User from "../models/User";
import Role from "../models/Role";
import jwt from "jsonwebtoken";
import config from "../config";

export const signUp = async (req, res) => {
  const { username, email, password, roles, confirm_password } = req.body;

  const errors = [];

  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "Password must have at least 4 characters" });
  }
  if (errors.length > 0) {
    res.render("/api/users/signup", {
      errors,
      username,
      email,
      password,
      confirm_password,
    });
  } else {
    const newUser = new User({
      username,
      email,
      password,
    });
    newUser.password = await newUser.encryptPassword(password);

    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
      expiresIn: 86400, //24 hours
    });

    req.flash("success_msg", "You have been successfully registered");
    res.redirect("/api/auth/signin");
  }
};
