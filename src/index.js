import app from "./app";
import "./database";
import "./config/passport";
import { PORT } from "./config";

//Settings
app.set("port", PORT || 5000);
app.listen(app.get("port"), () => {
  console.log("Server is running on port", PORT);
});
