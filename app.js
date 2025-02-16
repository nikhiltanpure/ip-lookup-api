require("dotenv").config();
const express = require("express");
const iplookuproutes = require("./routes/iplookup");

const app = express();

app.use(express.json());

app.use("/lookup", iplookuproutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Unexpected error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port", process.env.PORT);
});
