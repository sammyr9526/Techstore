import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import passport from "passport";
import { verifySign } from "../middlewares";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { SECRET } from "../config";

const router = Router();
router.get("/signin", (req, res) => {
  if (!req.user) res.render("users/signin");
  else res.redirect("/home");
});

router.get("/signup", (req, res) => {
  if (!req.user) res.render("users/signup");
  else res.redirect("/users/signup");
});

router.post(
  "/signup",
  [verifySign.checkDuplicatedUsernameOrEmail, verifySign.checkRolesExisted],
  authCtrl.signUp
);

router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/api/auth/signin",
    failureFlash: true,
  }),
  async function (req, res) {
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );
    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: 86400, //24 hours
    });
    let options = {
      path: "/",
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
      httpOnly: true, // The cookie only accessible by the web server
    };

    res.cookie("x-access-token", token, options);
    res.redirect("/home");
  }
);
router.get("/logout", (req, res, next) => {
  res.clearCookie("x-access-token");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
