const express = require("express");
const feedbackRouter = express.Router();
const {
  createFeedback,
  getFeedbacksByDateRange,
  replyFeedback,
  deleteFeedback,
  exportFeedbackReport,
} = require("../controllers/Feedback.controller");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Customer feedback management
 */

/**
 * @swagger
 * /api/v1/feedback:
 *   post:
 *     summary: Submit customer feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request
 */
feedbackRouter.post("/", authentication, createFeedback);

/**
 * @swagger
 * /api/v1/feedback/date-range:
 *   post:
 *     summary: Get feedbacks within a specific date range
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: List of feedbacks
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
feedbackRouter.post(
  "/date-range",
  authentication,
  authorize,
  getFeedbacksByDateRange
);

/**
 * @swagger
 * /api/v1/feedback/reply:
 *   post:
 *     summary: Send a reply to customer feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedbackId:
 *                 type: string
 *               replyMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Feedback not found
 */
feedbackRouter.post("/reply", authentication, authorize, replyFeedback);

/**
 * @swagger
 * /api/v1/feedback/{id}:
 *   delete:
 *     summary: Delete a feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 */
feedbackRouter.delete("/:id", authentication, authorize, deleteFeedback);

module.exports = {
  feedbackRouter,
};
