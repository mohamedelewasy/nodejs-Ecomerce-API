const express = require("express");
const router = express.Router();
const {
  createCashOrder,
  getAllOrders,
  getOrder,
  getLoggedUserOrder,
} = require("../services/orderServices");

const { protect, allowedTo } = require("../services/authServices");

router.route("/orders").get(protect, allowedTo("admin"), getAllOrders);
router.route("/orders/:id").get(protect, allowedTo("admin"), getOrder);
router.route("/order/me").get(protect, allowedTo("user"), getLoggedUserOrder);
router.route("/order/:id").post(protect, allowedTo("user"), createCashOrder);

module.exports = router;
