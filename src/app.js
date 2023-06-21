import express from "express"; //app.js will manage express
import path from "path";
import morgan from "morgan";
import { create } from "express-handlebars";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import index from "./routes/index";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { createRoles } from "./libs/initialSetup";
var cookieParser = require("cookie-parser");

//Initializing
const app = express();

app.set("views", path.join(__dirname, "views"));
const exphbs = create({
  defaultLayout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  extname: ".hbs",
});
//Settings
createRoles();

app.use(morgan("dev")); //shows all methods that server gets or send
app.use(express.json()); //show in console json objects

app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine);
app.set("view engine", ".hbs");
app.use(express.static(path.join(path.resolve("./"), "dist")));

//Middlewares

app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); //encode data like user info, extended:false cancel images receivement
app.use(methodOverride("_method"));
app.use(
  session({ secret: "mysecretapp", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
//routes
app.use("/", index);
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//Static Files
app.use(express.static(path.join(__dirname, "public")));

//Server is listening
app.listen(app.get("port"));

export default app;
