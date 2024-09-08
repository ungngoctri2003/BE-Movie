const express = require("express");
const { PopcornDrinks } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { uploadImage } = require("../middleware/uploads/upload-images");
const {
  create,
  deleteCombo,
  getAll,
  getDetails,
  update,
  changeStatusCombo,
} = require("../controllers/PopcornDrink.controller");
const popcornDrinkRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: PopcornDrinks
 *   description: Popcorn and drinks management API
 */

/**
 * @swagger
 * /api/v1/combos:
 *   post:
 *     summary: Create a new popcorn or drink item
 *     tags: [PopcornDrinks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Popcorn or drink item created successfully
 *       400:
 *         description: Bad request
 */
popcornDrinkRouter.post(
  "/",
  authentication,
  authorize,
  uploadImage("popcorn_drinks"),
  create
);

/**
 * @swagger
 * /api/v1/combos:
 *   get:
 *     summary: Get all popcorn and drink items
 *     tags: [PopcornDrinks]
 *     responses:
 *       200:
 *         description: List of all popcorn and drink items
 */
popcornDrinkRouter.get("/", getAll);

/**
 * @swagger
 * /api/v1/combos/{id}:
 *   get:
 *     summary: Get details of a popcorn or drink item by ID
 *     tags: [PopcornDrinks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The popcorn or drink item ID
 *     responses:
 *       200:
 *         description: Popcorn or drink item details
 *       404:
 *         description: Popcorn or drink item not found
 */
popcornDrinkRouter.get("/:id", checkExists(PopcornDrinks), getDetails);

/**
 * @swagger
 * /api/v1/combos/{id}:
 *   delete:
 *     summary: Delete a popcorn or drink item by ID
 *     tags: [PopcornDrinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The popcorn or drink item ID
 *     responses:
 *       200:
 *         description: Popcorn or drink item deleted successfully
 *       404:
 *         description: Popcorn or drink item not found
 */
popcornDrinkRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(PopcornDrinks),
  deleteCombo
);

/**
 * @swagger
 * /api/v1/combos/{id}:
 *   put:
 *     summary: Update a popcorn or drink item by ID
 *     tags: [PopcornDrinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The popcorn or drink item ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Popcorn or drink item updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Popcorn or drink item not found
 */
popcornDrinkRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(PopcornDrinks),
  uploadImage("popcorn_drinks"),
  update
);

/**
 * @swagger
 * /api/v1/combos/status/{id}:
 *   put:
 *     summary: Change the status of a popcorn or drink item
 *     tags: [PopcornDrinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The popcorn or drink item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Popcorn or drink item not found
 */
popcornDrinkRouter.put(
  "/status/:id",
  authentication,
  authorize,
  checkExists(PopcornDrinks),
  changeStatusCombo
);

module.exports = {
  popcornDrinkRouter,
};
