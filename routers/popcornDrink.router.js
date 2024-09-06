// routes/popcornDrink.routes.js
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
} = require("../controllers/PopcornDrink.controller");
const popcornDrinkRouter = express.Router();

popcornDrinkRouter.post(
  "/",
  authentication,
  authorize,
  uploadImage("popcorn_drinks"),
  create
);
popcornDrinkRouter.get("/", getAll);
popcornDrinkRouter.get("/:id", checkExists(PopcornDrinks), getDetails);
popcornDrinkRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(PopcornDrinks),
  deleteCombo
);
popcornDrinkRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(PopcornDrinks),
  uploadImage("popcorn_drinks"),
  update
);

module.exports = {
  popcornDrinkRouter,
};
