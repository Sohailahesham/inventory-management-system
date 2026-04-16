import jsonServer from "json-server";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const router = jsonServer.router("data/db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

app.use(middlewares);
app.use(express.static(__dirname));
app.use("/api", router);

app.listen(PORT, () => {
  console.log("Server running");
});
