require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const iplookuproutes = require("./routes/iplookup");
const setupSwagger = require("./swagger");

const {
  MAX_REQUEST_ALLOWED,
  TIME_IN_SECONDS,
  TIME_MILISECONDS,
} = require("./constants");

const app = express();

app.use(express.json());

setupSwagger(app);

const limiter = rateLimit({
  windowMs:
    parseInt(process.env.TIME_WINDOW_IN_SECONDS) * TIME_MILISECONDS ||
    TIME_IN_SECONDS * TIME_MILISECONDS,
  max: parseInt(process.env.MAX_REQUEST_ALLOWED) || MAX_REQUEST_ALLOWED, // Limit each IP to 5 requests per minute
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

app.use("/lookup", iplookuproutes);

app.use((err, req, res, next) => {
  console.error(`Unexpected error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port", process.env.PORT);
});

module.exports = app;
