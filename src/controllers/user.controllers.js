import User from "../models/User";
import Role from "../models/Role";
import jwt from "jsonwebtoken";
import SECRET from "../config";

export const showUsers = async (req, res) => {
  const users = await User.find().lean();
  res.render("users/view-users", { users });
};

export const createUser = async (req, res) => {
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
      const foundRoles1 = await Role.findOne({ name: "admin" });
      if (roles === "admin") {
        newUser.roles[0] = [foundRoles1._id];
        const foundRoles2 = await Role.findOne({ name: "moderator" });
        newUser.roles[1] = [foundRoles2._id];
        const foundRoles3 = await Role.findOne({ name: "user" });
        newUser.roles[2] = [foundRoles3._id];
      } else {
        if (roles === "moderator") {
          newUser.roles[0] = [foundRoles1._id];
          const foundRolesm2 = await Role.findOne({ name: "user" });
          newUser.roles[1] = [foundRolesm2._id];
        } else {
          const role = await Role.findOne({ name: "user" });
          newUser.roles = [role._id];
        }
      }
    }

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400,
    });

    req.flash("success_msg", "New user have been successfully registered");
    res.redirect("/api/users");
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (user.username === "Sammyr" || user.username === req.user.username) {
    req.flash("error_msg", " You can't change information of this user");
    res.redirect("/api/users");
  } else {
    await User.findByIdAndDelete(req.params.id);
    res.render("users/edit-user", { user });
  }
};

export const saveUpdatedUser = async (req, res) => {
  const user = await User.findById(req.params.id).lean();

  const { username, email, password, confirm_password, roles } = req.body;

  const errors = [];

  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "Password must have at least 4 characters" });
  }

  if (errors.length > 0) {
    res.render("users/edit-user", {
      errors,
      user,
    });
  } else {
    const updatedUser = new User({
      username,
      email,
      password,
    });

    updatedUser.password = await updatedUser.encryptPassword(password);

    if (roles) {
      const foundRoles1 = await Role.findOne({ name: "admin" });
      if (roles === "admin") {
        updatedUser.roles[0] = [foundRoles1._id];
        const foundRoles2 = await Role.findOne({ name: "moderator" });
        updatedUser.roles[1] = [foundRoles2._id];
        const foundRoles3 = await Role.findOne({ name: "user" });
        updatedUser.roles[2] = [foundRoles3._id];
      } else {
        const foundRolesm1 = await Role.findOne({ name: "moderator" });
        if (roles === "moderator") {
          updatedUser.roles[0] = [foundRolesm1._id];
          const foundRolesm2 = await Role.findOne({ name: "user" });
          updatedUser.roles[1] = [foundRolesm2._id];
        } else {
          const role = await Role.findOne({ name: "user" });
          updatedUser.roles = [role._id];
        }
      }
    }

    await User.findByIdAndUpdate(req.params.id, {
      username: updatedUser.username,
      email: updatedUser.email,
      password: updatedUser.password,
      roles: updatedUser.roles,
    });

    req.flash("success_msg", " User have been updated");
    res.redirect("/api/users");
  }
};

export const deleteUser = async (req, res) => {
  const userfound = await User.findById(req.params.id);
  if (
    userfound.username === "Sammyr" ||
    userfound.username === req.user.username
  ) {
    req.flash("error_msg", " You can't delete this user");
    res.redirect("/api/users");
  } else {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success_msg", " User have been deleted");
    res.redirect("/api/users");
  }
};

export const searchUser = async (req, res) => {
  const userfound = await User.findOne({ username: req.body.name }).lean();

  res.render("users/search-user", { userfound });
};
