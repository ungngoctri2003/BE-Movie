const { Tickets, Seats, Users, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const create = async (req, res, next) => {
  const { user, listTicket } = req.body;
  try {
    const checkUser = await Users.findOne({
      where: {
        id: user.id,
        isActive: true,
      },
    });
    if (checkUser) {
      let ticketSuccess = [];
      for (const ticket of listTicket) {
        const seat = await Seats.findOne({ where: { id: ticket.id } });
        if (seat.bookded) {
          res.status(403).send("Ghế đã có người đặt");
        } else {
          const newTicket = await Tickets.create({
            seatId: ticket.id,
            userId: user.id,
            price: ticket.price,
          });
          if (newTicket) {
            seat.idUser = user.id;
            seat.bookded = true;
            await seat.save();
            await ticketSuccess.push(seat);
          }
        }
      }
      req.ticketSuccess = ticketSuccess;
      next();
    } else {
      res.status(400).send("Tài khoản tạm đã bị khóa");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketByIdUser = async (req, res) => {
  const { id } = req.params;
  try {
    const lstTicket = await Tickets.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: Seats,
          as: "seat",
        },
      ],
    });
    lstTicket.forEach((element) => {
      element.seatId = undefined;
      element.userId = undefined;
    });
    res.status(200).send(lstTicket);
  } catch (error) {
    res.status(500).send(error);
  }
};
const listTicketWithUser = async (req, res) => {
  const { id } = req.params;
  try {
    sequelize
      .query(
        `select distinct  showtimes.id as idShowTime , nameFilm , imgFilm, groupName , name as cinemaName, roomName ,showDate
        from ((((((showtimes
        inner join films on showtimes.idFilm =  films.id)
        inner join seats on showtimes.id =  seats.idShowTime)
        inner join rooms on showtimes.idRoom = rooms.id) 
        inner join tickets on seats.id =  tickets.seatId)
        inner join cinemas on showtimes.idCinema =  cinemas.id)
        inner join groupcinemas on cinemas.idGroupCinema =  groupcinemas.id)
        where tickets.userId =${id}`,
        { type: QueryTypes.SELECT }
      )
      .then(async (data) => {
        let hacks = [];
        for (const showtime of data) {
          const lstTicket = await sequelize.query(
            `select  seats.id, seatName ,tickets.createdAt   
                    from ((showtimes
                    inner join seats on showtimes.id =  seats.idShowTime)
                    inner join tickets on seats.id =  tickets.seatId)
                    where showtimes.id = ${showtime.idShowTime} and tickets.userId = ${id}`,
            { type: QueryTypes.SELECT }
          );
          showtime.lstTicket = lstTicket;
          hacks = [...hacks, showtime];
        }
        res.status(200).send(hacks);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};
const getToTalWithMonth = async (req, res) => {
  try {
    let arr = [];
    for (let index = 1; index <= 12; index++) {
      const result = await sequelize.query(
        `
            select sum(price) as total from tickets where  month(createdAt) = ${index};
            `,
        { type: QueryTypes.SELECT }
      );
      let totalWithMonth = result[0];
      if (totalWithMonth.total === null) {
        totalWithMonth.total = 0;
      }
      arr = [...arr, totalWithMonth];
    }
    res.status(200).send(arr);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  create,
  getTicketByIdUser,
  listTicketWithUser,
  getToTalWithMonth,
};
