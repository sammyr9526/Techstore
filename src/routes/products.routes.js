import { Router } from "express";
import { helpers } from "../middlewares/authjwt";
const router = Router();

import * as productsCtrl from "../controllers/products.controllers";
import { authJwt } from "../middlewares/";
import Products from "../models/Products";

router.get(
  "/",
  [helpers.isAuthenticated, authJwt.verifyToken, authJwt.checkRoles],
  productsCtrl.getProducts,
  (req, res) => {
    res.render("products/view-products");
  }
);

router.get(
  "/add",
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.checkRoles,
  authJwt.isModerator,
  (req, res) => {
    res.render("products/add-products");
  }
);

router.post(
  "/add",
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.isModerator,
  productsCtrl.createProduct,
  (req, res) => {
    res.render("products/add-products");
  }
);

router.get(
  "/edit/:id",
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.checkRoles,
  authJwt.isModerator,
  async (req, res) => {
    const product = await Products.findById(req.params.id).lean();
    console.log(product);
    res.render("products/edit-products", { product });
  }
);

router.put(
  "/edit-product/:id",
  [helpers.isAuthenticated, authJwt.verifyToken, authJwt.isModerator],
  async (req, res) => {
    const product = await Products.findById(req.params.id).lean();
    const { name, imgURL, price, category } = req.body;
    const errors = [];

    if (price < 0)
      errors.push({ text: "Price must have be a positive number" });

    if (errors.length > 0)
      res.render("products/edit-products", {
        errors,
        product,
      });
    else {
      await Products.findByIdAndUpdate(req.params.id, {
        name,
        imgURL,
        price,
        category,
      });
      console.log(req.body);

      req.flash("success_msg", " Product have been updated");
      res.redirect("/api/products");
    }
  }
);

router.get(
  "/search_product",
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.checkRoles,
  (req, res) => {
    res.render("products/search-products");
  }
);

router.post(
  "/search_product",
  helpers.isAuthenticated,
  authJwt.verifyToken,
  authJwt.checkRoles,
  productsCtrl.searchProduct
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  productsCtrl.deleteProductsById
);

export default router;
