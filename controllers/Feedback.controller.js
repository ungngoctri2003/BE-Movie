const { Feedback } = require("../models");
const nodemailer = require("nodemailer");
const validator = require("validator");
const { google } = require("googleapis");
const { Op } = require("sequelize");
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
require("dotenv").config();

// OAuth2 setup for sending emails
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Tạo phản hồi mới từ khách hàng
const createFeedback = async (req, res) => {
  const { name, email, message, cumRap, rapChieu } = req.body;

  try {
    const feedback = await Feedback.create({
      name,
      email,
      message,
      cumRap,
      rapChieu,
    });

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi tạo phản hồi." });
  }
};

// const getFeedbacks = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.findAll();
//     res.status(200).json({ success: true, feedbacks });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Lỗi khi lấy danh sách phản hồi." });
//   }
// };

// Gửi phản hồi lại cho khách hàng qua email
const replyFeedback = async (req, res) => {
  const { replyMessage, email } = req.body;
  // Kiểm tra tính hợp lệ của email
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Email không hợp lệ." });
  }
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "lamcongtri2003@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    let info = await transporter.sendMail({
      from: '"Beta Movie" <lamcongtri2003@gmail.com>', // sender address
      to: email.toLowerCase(), // receiver email
      subject: "PHẢN HỒI TỪ QUẢN TRỊ VIÊN RẠP CHIẾU BETACIEMAS", // Subject line
      attachDataUrls: true,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
    <h2 style="color: #333;">Phản hồi từ Beta Movie</h2>
    <p style="font-size: 16px; color: #555;">${replyMessage}</p>
    <p style="font-size: 16px; color: #555;">
      Nếu bạn muốn phản hồi lại cho chúng tôi, vui lòng
      <a href="http://localhost:3000/Feedback" style="color: #1a73e8; text-decoration: none; font-weight: bold;">nhấn vào đây</a>
      để gửi phản hồi hoặc trả lời trực tiếp vào email này.
    </p>
    <p style="font-size: 16px; color: #555;">Cảm ơn bạn!</p>
    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
  </div>
`, // html body
    });

    if (req.userRegister) {
      res.status(201).send({
        notify: "SUCCESS",
        newUser: req.userRegister,
      });
    } else {
      res.status(201).send({
        notify: "SUCCESS",
        // newUser: req.ticketSuccess,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi gửi phản hồi qua email." });
  }
};

// Xóa phản hồi
const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Phản hồi không tồn tại." });
    }

    await feedback.destroy();
    res
      .status(200)
      .json({ success: true, message: "Phản hồi đã được xóa thành công." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa phản hồi." });
  }
};
// phản hồi theo khoảng thời gian
const getFeedbacksByDateRange = async (req, res) => {
  const { startDate, endDate } = req.body; // Đọc từ body thay vì query

  try {
    const whereCondition = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Điều chỉnh thời gian của endDate để bao gồm cả cuối ngày
      end.setHours(23, 59, 59, 999);

      whereCondition.createdAt = {
        [Op.between]: [start, end],
      };
    }

    const feedbacks = await Feedback.findAll({
      where: whereCondition,
    });

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy phản hồi" });
  }
};

module.exports = {
  createFeedback,
  replyFeedback,
  deleteFeedback,
  getFeedbacksByDateRange,
};
