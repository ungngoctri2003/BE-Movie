const express = require("express");
const { checkoutRouter } = require("./Checkout.router");
const { cinemasRouter } = require("./Cinema.router");
const { filmsRouter } = require("./Film.routers");
const { groupCinemasRouter } = require("./GroupCinema.router");
const { roomRouter } = require("./Room.router");
const { seatRouter } = require("./Seat.router");
const { showTimeRouter } = require("./ShowTimes.router");
const { ticketRouter } = require("./Ticket.router");
const { TypeUserRouter } = require("./TypeUser.routers");
const { userRouter } = require("./User.routers");
const { bannerRoute } = require("./Banner.router");

const rootRouter = express.Router();
rootRouter.use("/typeUsers", TypeUserRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/films", filmsRouter);
rootRouter.use("/showTimes", showTimeRouter);
rootRouter.use("/cinemas", cinemasRouter);
rootRouter.use("/groupCinemas", groupCinemasRouter);
rootRouter.use("/rooms", roomRouter);
rootRouter.use("/seats", seatRouter);
rootRouter.use("/tickets", ticketRouter);
rootRouter.use("/checkout", checkoutRouter);
rootRouter.use("/banners", bannerRoute);
module.exports = {
  rootRouter,
};
