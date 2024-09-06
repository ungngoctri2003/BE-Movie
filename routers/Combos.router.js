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
  getComboCountByDay,
  listComboWithUser,
} = require("../controllers/Combos.controller");

const comboRouter = express.Router();

// Route tạo combo mới, yêu cầu xác thực và phân quyền
comboRouter.post("/", authentication, createCombo);

// Route lấy danh sách combo theo người dùng, yêu cầu xác thực
comboRouter.get("/user/:id", getComboByIdUser);

comboRouter.get(
  "/listCombos/:id",
  // authentication,
  // checkExists(Users),
  listComboWithUser
);

// Route lấy tổng giá trị combo theo tháng, yêu cầu xác thực
comboRouter.get("/total/month", authentication, getTotalComboWithMonth);

// Route lấy tổng giá trị combo theo ngày, yêu cầu xác thực
comboRouter.get("/total/day", authentication, getTotalComboWithDay);

// Route đếm số lượng combo theo ngày, yêu cầu xác thực
comboRouter.post("/count/day", authentication, getComboCountByDay);

module.exports = {
  comboRouter,
};
