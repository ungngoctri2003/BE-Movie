const express = require("express");
const { RequirementCheckout } = require("../controllers/Checkout.controller");
const { authentication } = require("../middleware/auth/authentication");
const { Verify_Account } = require("../middleware/auth/verifyAccount");

const checkoutRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Checkout operations
 */

/**
 * @swagger
 * /api/v1/checkout:
 *   post:
 *     summary: Process checkout
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 description: List of items for checkout
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       description: ID of the item
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the item
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method chosen by the user
 *     responses:
 *       200:
 *         description: Checkout processed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
checkoutRouter.post("/", authentication, Verify_Account, RequirementCheckout);

module.exports = {
  checkoutRouter,
};
