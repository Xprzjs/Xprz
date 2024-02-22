const express = require("express");
const router = express.Router();

// Define user routes
router.get("/", (req, res) => {
  // Handle GET request for retrieving users
  res.send("GET /users");
});

// Export a function that returns the router
module.exports = function() {
  return router;
};
