const express = require("express");
const router = express.Router();
const regeisterController = require("../controllers/regeisterController");

router.post("/", regeisterController.handleNewUser);

module.exports = router;
