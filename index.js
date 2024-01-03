"use strict";
const { config } = require("dotenv");
const express = require('express');
const bodyParser = require("body-parser");
const cryptoRoutes = require("./routes/crypto.routes");

const app = express();
const cors = require("cors");

const ENV = process.argv[2] || process.env.NODE_ENV || "dev";
if (ENV === "production") {
    config(); 
} else {
    config({ path: "./.env" }); 
}

const PORT = process.env.PORT  

app.use(bodyParser.json());
app.use(cors());

app.use("/crypto", cryptoRoutes);

app.get("/", (req, res) => {
    res.send("Hey, server is running ");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENV} mode`);
});

module.exports = app;