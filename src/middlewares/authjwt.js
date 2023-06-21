import User from "../models/User";
import Role from "../models/Role";
import { SECRET } from "../config";
import jwt from "jsonwebtoken";
export const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Not Authorized");
  res.redirect("/");
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies["x-access-token"];
    const decoded = jwt.verify(token, SECRET);
    req.cookies.userId = decoded.id;
    const user = await User.findById(req.cookies.userId, { password: 0 });

    next();
  } catch (error) {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/");
  }
};

export const isModerator = async (req, res, next) => {
  if (req.cookies.userId) {
    const user = await User.findById(req.cookies.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        res.locals.moderator = roles[i].name;
        next();
        return;
      }
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/home");
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.cookies.userId) {
    const user = await User.findById(req.cookies.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        res.locals.admin = roles[i].name;
        next();
        return;
      }
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/home");
  }
};

export const checkRoles = async (req, res, next) => {
  res.locals.admin = null;
  res.locals.moderator = null;
  if (req.cookies.userId) {
    const user = await User.findById(req.cookies.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        res.locals.admin = roles[i].name;
      } else {
        if (roles[i].name === "moderator") {
          res.locals.moderator = roles[i].name;
        }
      }
    }
    next();
    return res.locals.admin, res.locals.moderator;
  }
};
