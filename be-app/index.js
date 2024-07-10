// index.js
require("./tracing"); // Khởi động tracing trước khi các module khác
const express = require("express");
const app = express();
const port = 6000;

app.get("/api/data", (req, res) => {
  res.send({ message: "Hello from backend!dfudosifudsfdsusfdufdsoi" });
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhoaaast:${port}`);
});
