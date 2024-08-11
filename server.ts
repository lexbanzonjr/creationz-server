import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
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
app.use("/api", require("./routes/authRoute"));

app.get("/hello", function (req, res) {
  res.send("Hello World!");
});

const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log("Connected."));
