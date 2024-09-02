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

// API để nhận phản hồi từ khách hàng
feedbackRouter.post("/", authentication, createFeedback);

// API để lấy danh sách phản hồi với khoảng ngày trong body
feedbackRouter.post(
  "/date-range",
  authentication,
  authorize,
  getFeedbacksByDateRange
); // Chuyển sang sử dụng POST

// API để gửi phản hồi lại cho khách hàng
feedbackRouter.post("/reply", authentication, authorize, replyFeedback);
feedbackRouter.delete("/:id", authentication, authorize, deleteFeedback);
module.exports = {
  feedbackRouter,
};
