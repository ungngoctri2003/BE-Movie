const express = require("express");
const { TypeUser } = require("../models");
const {
  createTypeUser,
  getAll,
  getDetails,
  deleteTypeUser,
  update,
} = require("../controllers/TyepeUser.controllers");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");

const TypeUserRouter = express.Router();

/**
 * @swagger
 * /api/v1/typeUsers:
 *   post:
 *     summary: Create a new user type
 *     tags: [TypeUsers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User type created successfully
 *       400:
 *         description: Bad request
 */
TypeUserRouter.post("/", authentication, authorize, createTypeUser);

/**
 * @swagger
 * /api/v1/typeUsers:
 *   get:
 *     summary: Get all user types
 *     tags: [TypeUsers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user types
 *       401:
 *         description: Unauthorized
 */
TypeUserRouter.get("/", authentication, authorize, getAll);

/**
 * @swagger
 * /api/v1/typeUsers/{id}:
 *   get:
 *     summary: Get user type details by ID
 *     tags: [TypeUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user type ID
 *     responses:
 *       200:
 *         description: User type details
 *       404:
 *         description: User type not found
 */
TypeUserRouter.get(
  "/:id",
  authentication,
  authorize,
  checkActive(TypeUser),
  getDetails
);

/**
 * @swagger
 * /api/v1/typeUsers/{id}:
 *   delete:
 *     summary: Delete a user type by ID
 *     tags: [TypeUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user type ID
 *     responses:
 *       200:
 *         description: User type deleted successfully
 *       404:
 *         description: User type not found
 */
TypeUserRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(TypeUser),
  deleteTypeUser
);

/**
 * @swagger
 * /api/v1/typeUsers/{id}:
 *   put:
 *     summary: Update a user type by ID
 *     tags: [TypeUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user type ID
 *     responses:
 *       200:
 *         description: User type updated successfully
 *       404:
 *         description: User type not found
 */
TypeUserRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(TypeUser),
  checkActive(TypeUser),
  update
);

module.exports = {
  TypeUserRouter,
};
