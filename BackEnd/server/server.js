import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "../Config/db.js";
import route from "../Routes/products.js";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "5mb" }));
app.use("/api/products", route);

if (process.env.NODE_ENV == "production") {
  app.use(
    express.static(path.join(__dirname, "/FrontEnd/Product-Front-End/dist")),
  );

  app.get((req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "FrontEnd",
        "Product-Front-End",
        "dist",
        "index.html",
      ),
    );
  });
}

app.listen(port, () => {
  connectDB();
  console.log(`app listening on http://localhost:${port}!`);
});
