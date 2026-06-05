require("dotenv").config(); // ← ADD THIS as line 1

const exp = require("express");
const app = exp();
const cors = require("cors");
const connect = require("./server/config/db");
const cookieParser = require("cookie-parser");
const router = require("./server/routes/routes");
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(exp.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

connect();

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});
app.use(router);

app.listen(PORT, () => {
  console.log("here we go");
});

module.exports = app;
