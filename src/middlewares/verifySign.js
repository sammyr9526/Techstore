import Role, { ROLES } from "../models/Role";
import User from "../models/User";

export const checkDuplicatedUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    if (res.locals.admin)
      return (
        req.flash("error_msg", "The user have been already registered"),
        res.redirect("/api/users/add-user")
      );
    else
      return (
        req.flash("error_msg", "The user have been already registered"),
        res.redirect("signup")
      );
  }

  const email = await User.findOne({ email: req.body.email });
  if (email) {
    if (res.locals.admin)
      return (
        req.flash("error_msg", "The email have been already registered"),
        res.redirect("/api/users/add-user")
      );
    else
      return (
        req.flash("error_msg", "The email have been already registered"),
        res.redirect("signup")
      );
  }
  next();
};

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res
          .status(400)
          .json({ message: `Role ${req.body.roles[i]} does not exists` });
      }
    }
  }
  next();
};

export const getRoles = async (roles, newroles) => {
  if (roles) {
    return (newroles = "admin");
  }
  return newroles;
};
