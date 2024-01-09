const express = require("express");
const { RequirementCheckout } = require("../controllers/Checkout.controller");
const { authentication } = require("../middleware/auth/authentication");
const { Verify_Account } = require("../middleware/auth/verifyAccount");
const checkoutRouter = express.Router();

checkoutRouter.post("/", authentication, Verify_Account, RequirementCheckout);

module.exports = {
  checkoutRouter,
};
