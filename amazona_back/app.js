const express = require("express");
const path = require("path");
const mainRouter = require("./Routes/mainRouter");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.MONGO_KEY)
  .then((res) => {
    console.log("CONNECTED MONGODB");
  })
  .catch((e) => {
    console.log(e.message);
  });

app.use("/", mainRouter);

// serves frontend build folder
app.use(express.static(path.join(__dirname, "/amazona_front/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/amazona_front/build/index.html"))
);

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
