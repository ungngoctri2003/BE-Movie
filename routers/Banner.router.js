const express = require("express");
const { Banners } = require("../models");

const {
  getAll,
  getDetail,
  createBanner,
  updateBanner,
  deleteBanner,
  ChangeStatusBanner,
} = require("../controllers/Banner.controller");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { uploadImage } = require("../middleware/uploads/upload-images");
const { checkExists } = require("../middleware/validations/checkExists");
const bannerRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Banner
 *   description: Banner management
 */

/**
 * @swagger
 * /api/v1/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banner]
 *     responses:
 *       200:
 *         description: List of banners
 *       500:
 *         description: Internal server error
 */
bannerRoute.get("/", getAll);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner data
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Internal server error
 */
bannerRoute.get(
  "/:id",
  authentication,
  authorize,
  checkExists(Banners),
  getDetail
);

/**
 * @swagger
 * /api/v1/banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner created
 *       400:
 *         description: Bad request
 */
bannerRoute.post(
  "/",
  authentication,
  authorize,
  uploadImage("banner"),
  createBanner
);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Banner updated
 *       404:
 *         description: Banner not found
 *       400:
 *         description: Bad request
 */
bannerRoute.put(
  "/:id",
  authentication,
  authorize,
  checkExists(Banners),
  uploadImage("banner"),
  updateBanner
);

/**
 * @swagger
 * /api/v1/banners/status/{id}:
 *   put:
 *     summary: Change status of a banner
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner status updated
 *       404:
 *         description: Banner not found
 *       400:
 *         description: Bad request
 */
bannerRoute.put(
  "/status/:id",
  authentication,
  authorize,
  checkExists(Banners),
  ChangeStatusBanner
);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner deleted
 *       404:
 *         description: Banner not found
 *       400:
 *         description: Bad request
 */
bannerRoute.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(Banners),
  deleteBanner
);

module.exports = {
  bannerRoute,
};
