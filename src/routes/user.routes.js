import { Router } from "express";
import * as userCtrl from "..//controllers/user.controllers";
import { authJwt } from "../middlewares";
import { helpers } from "../middlewares/authjwt";
import { checkDuplicatedUsernameOrEmail } from "../middlewares/verifySign";

const router = Router();

router.get("/", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  userCtrl.showUsers,
]);

router.get("/add-user", authJwt.verifyToken, authJwt.isAdmin, (req, res) => {
  res.render("users/add-user");
});

router.post("/add", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  checkDuplicatedUsernameOrEmail,
  userCtrl.createUser,
]);

router.get("/edit/:id", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  userCtrl.updateUser,
]);

router.put("/edit-user/:id", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  userCtrl.saveUpdatedUser,
]);

router.delete("/:id", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  userCtrl.deleteUser,
]);

router.get("/search-user", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  (req, res) => {
    res.render("users/search-user");
  },
]);

router.post("/search-user", [
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isAdmin,
  userCtrl.searchUser,
]);

export default router;
