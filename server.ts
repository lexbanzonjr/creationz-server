import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
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
app.use("/user", require("./routes/userRoute"));
app.use("/auth", require("./routes/authRoute"));

app.use("/yahoo/auth", require("./routes/yahoo/authRoute"));
app.use("/yahoo/fantasy/", require("./routes/yahoo/fantasyRoute"));
app.use(
  "/yahoo/fantasy/basketball",
  require("./routes/yahoo/fantasy/basketballRoute")
);

app.get("/hello", function (req, res) {
  res.send("Hello World!");
});

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
