
const express = require("express");
const env = require("../config/env");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: env.serviceName,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
