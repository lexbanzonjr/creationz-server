import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import { tokenMiddleware } from "./middlewares/tokenMiddleware";

const { dbConnect } = require("./utils/db");
const app = express();
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(tokenMiddleware);
app.use("/user", require("./routes/userRoute"));
app.use("/auth", require("./routes/authRoute"));

app.use("/binary", require("./routes/binaryRoute"));
app.use("/category", require("./routes/categoryRoute"));
app.use("/product", require("./routes/productRoute"));
app.use("/type", require("./routes/typeRoute"));
app.use("/cart", require("./routes/cartRoute"));

app.get("/hello", function (req, res) {
  res.send("Hello World!");
});

app.use(loggingMiddleware);

const port = process.env.PORT;
dbConnect();

// Load SSL certificate and key
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "./certs/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "./certs/server.cert")),
};
// app.listen(port, () => console.log("Connected."));
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Secure server is running at https://localhost:${port}`);
});
