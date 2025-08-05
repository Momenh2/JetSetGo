// src/index.js
const express = require("express");
const router = require("./router");
const PORT = 1338;
const app = express();

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});
