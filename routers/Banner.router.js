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

bannerRoute.get("/", getAll);
bannerRoute.get(
  "/:id",
  authentication,
  authorize,
  checkExists(Banners),
  getDetail
);
bannerRoute.post(
  "/",
  authentication,
  authorize,
  uploadImage("banner"),
  createBanner
);
bannerRoute.put(
  "/:id",
  authentication,
  authorize,
  checkExists(Banners),
  uploadImage("banner"),
  updateBanner
);
bannerRoute.put(
  "/status/:id",
  authentication,
  authorize,
  checkExists(Banners),
  ChangeStatusBanner
);
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
