const express = require("express");
const { Users } = require("../models");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const {
  signUp,
  signIn,
  updateUser,
  getAllUser,
  getDetailsUser,
  deleteUser,
  BlockAndUnBlock,
  getUserWithShowTimeID,
  verifyEmail,
  sendVerify,
  requestPasswordReset,
  resetPassword,
  forgotPassword,
} = require("../controllers/User.controllers");
const { uploadImage } = require("../middleware/uploads/upload-images");
const {
  contentVerifyEmail,
} = require("../middleware/nodoMailer/contentMail/contentVerifyEmail");
const { sendMail } = require("../middleware/nodoMailer");
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management API
 */

/**
 * @swagger
 * /api/v1/users/forgotPassword:
 *   post:
 *     summary: Initiate password reset process and send email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email sent for password reset
 *       400:
 *         description: Bad request
 */
userRouter.post("/forgotPassword", forgotPassword, sendMail);

/**
 * @swagger
 * /api/v1/users/signUp:
 *   post:
 *     summary: Sign up a new user and send verification email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully and verification email sent
 *       400:
 *         description: Bad request
 */
userRouter.post("/signUp", signUp, contentVerifyEmail, sendMail);

/**
 * @swagger
 * /api/v1/users/sendVerify:
 *   post:
 *     summary: Send a new verification email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent
 *       401:
 *         description: Unauthorized
 */
userRouter.post(
  "/sendVerify",
  authentication,
  sendVerify,
  contentVerifyEmail,
  sendMail
);

/**
 * @swagger
 * /api/v1/users/signIn:
 *   post:
 *     summary: Sign in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.post("/signIn", signIn);

/**
 * @swagger
 * /api/v1/users/verify:
 *   get:
 *     summary: Verify user email
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Bad request
 */
userRouter.get("/verify", verifyEmail);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
userRouter.put(
  "/:id",
  authentication,
  checkExists(Users),
  checkActive(Users),
  uploadImage("avatar"),
  updateUser
);

/**
 * @swagger
 * /api/v1/users/block/{id}:
 *   put:
 *     summary: Block or unblock a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to block or unblock
 *     responses:
 *       200:
 *         description: User blocked or unblocked successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.put(
  "/block/:id",
  authentication,
  authorize,
  checkExists(Users),
  BlockAndUnBlock
);

/**
 * @swagger
 * /api/v1/users/userWithShowTime:
 *   get:
 *     summary: Get users with show time ID
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users with show time ID
 */
userRouter.get("/userWithShowTime", getUserWithShowTimeID);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/", authentication, authorize, getAllUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get details of a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 */
userRouter.get(
  "/:id",
  authentication,
  checkExists(Users),
  checkActive(Users),
  getDetailsUser
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(Users),
  deleteUser
);

module.exports = {
  userRouter,
};
