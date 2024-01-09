const express = require("express");
const { Seats } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  create,
  getByIdShowTime,
  update,
  details,
} = require("../controllers/Seat.controller");

const seatRouter = express.Router();
seatRouter.post("/", authentication, authorize, create);
seatRouter.put("/", authentication, authorize, update);
seatRouter.get("/", authentication, getByIdShowTime);
seatRouter.get("/priceSeats", authentication, authorize, details);

module.exports = {
  seatRouter,
};
