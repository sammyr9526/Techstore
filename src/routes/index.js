import { Router } from "express";
import { helpers } from "../middlewares/authjwt";
import { authJwt } from "../middlewares";

const router = Router();
router.get("/", (req, res) => {
  if (!req.user) res.render("index");
  else res.redirect("/home");
});

router.get(
  "/home",
  [helpers.isAuthenticated, authJwt.verifyToken, authJwt.checkRoles],
  (req, res) => {
    res.render("home");
  }
);

router.get("/about", (req, res) => {
  res.render("about");
});

export default router;
