const express = require("express");
const { Combos, Users } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  createCombo,
  getComboByIdUser,
  getTotalComboWithMonth,
  getTotalComboWithDay,
  getComboByDay,
  listComboWithUser,
} = require("../controllers/Combos.controller");

const comboRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Combos
 *   description: Combo management
 */

/**
 * @swagger
 * /api/v1/comboBy:
 *   post:
 *     summary: Create a new combo
 *     tags: [Combos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Combo created
 *       400:
 *         description: Bad request
 */
comboRouter.post("/", authentication, createCombo);

/**
 * @swagger
 * /api/v1/comboBy/user/{id}:
 *   get:
 *     summary: Get combos by user ID
 *     tags: [Combos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of combos by user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
comboRouter.get("/user/:id", authentication, getComboByIdUser);

/**
 * @swagger
 * /api/v1/comboBy/listCombos/{id}:
 *   get:
 *     summary: Get combo list for a user
 *     tags: [Combos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of combos for the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
comboRouter.get(
  "/listCombos/:id",
  authentication,
  checkExists(Users),
  listComboWithUser
);

/**
 * @swagger
 * /api/v1/comboBy/total/month:
 *   get:
 *     summary: Get total combo value by month
 *     tags: [Combos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total combo value for the month
 *       500:
 *         description: Internal server error
 */
comboRouter.get("/total/month", authentication, getTotalComboWithMonth);

/**
 * @swagger
 * /api/v1/comboBy/total/day:
 *   get:
 *     summary: Get total combo value by day
 *     tags: [Combos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total combo value for the day
 *       500:
 *         description: Internal server error
 */
comboRouter.get("/total/day", authentication, getTotalComboWithDay);

/**
 * @swagger
 * /api/v1/comboBy/day:
 *   post:
 *     summary: Get combos count by day
 *     tags: [Combos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Number of combos on that day
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
comboRouter.post("/day", authentication, getComboByDay);

module.exports = {
  comboRouter,
};
