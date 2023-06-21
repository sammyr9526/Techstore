import Product from "../models/Products";

export const searchData = [];

export const createProduct = async (req, res) => {
  const { name, category, price, imgURL } = req.body;
  const errors = [];

  if (price < 0) errors.push({ text: "Price must have be a positive number" });

  if (errors.length > 0)
    res.render("products/add-products", {
      errors,
      name,
      category,
      price,
      imgURL,
    });
  else {
    const newProduct = new Product({ name, category, price, imgURL });
    const productSaved = await newProduct.save();

    req.flash("success_msg", "New product have been created");
    res.redirect("/api/products");
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find().lean();

  res.render("products/view-products", { products });
};

export const searchProduct = async (req, res) => {
  const product = await Product.find({ name: req.body.name }).lean();
  res.render("products/search-products", { product });
};

export const deleteProductsById = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  req.flash("success_msg", "Product have been deleted");
  res.redirect("/api/products");
};
