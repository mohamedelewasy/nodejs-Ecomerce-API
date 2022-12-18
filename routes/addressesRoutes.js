const express = require("express");
const router = express.Router();
const {
  addAddress,
  deleteAddress,
  getAddresses,
} = require("../services/addressServices");

const { protect, allowedTo } = require("../services/authServices");

router
  .route("/addresses")
  .get(protect, allowedTo("user"), getAddresses)
  .post(protect, allowedTo("user"), addAddress);
router
  .route("/addresses/:id")
  .delete(protect, allowedTo("user"), deleteAddress);

module.exports = router;
