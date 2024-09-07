const express = require("express");
const { Tickets, Users } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  create,
  getTicketByIdUser,
  listTicketWithUser,
  getToTalWithMonth,
  getTotalWithDay,
  getTicketByDay,
} = require("../controllers/Ticket.controller");
const { checkUserBlock } = require("../middleware/validations/checkUserBlock");
const {
  contentQRcode,
} = require("../middleware/nodoMailer/contentMail/contentQrCode");
const { sendMail } = require("../middleware/nodoMailer");
const ticketRouter = express.Router();

ticketRouter.get("/total", authentication, authorize, getToTalWithMonth);
ticketRouter.get("/totalByDay", authentication, authorize, getTotalWithDay);
ticketRouter.post("/", authentication, create, contentQRcode, sendMail);
ticketRouter.get("/:id", authentication, getTicketByIdUser);
ticketRouter.post("/test", contentQRcode, sendMail);
ticketRouter.get(
  "/listTicket/:id",
  authentication,
  checkExists(Users),
  listTicketWithUser
);
ticketRouter.post("/day", getTicketByDay);
module.exports = {
  ticketRouter,
};
