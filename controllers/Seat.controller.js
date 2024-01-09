const { Seats, Rooms, Users, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const { Socket } = require("../utils/socket");

const create = async (req, res) => {
  const { price, idRoom, idShowTime } = req.body;
  try {
    const detailsSeats = await Seats.findOne({ where: { idShowTime } });
    if (!detailsSeats) {
      const detailsRoom = await Rooms.findOne({ where: { id: idRoom } });
      if (detailsRoom) {
        const createLstSeat = async (detailsRoom) => {
          let lstSeat = [];
          for (let i = 1; i <= detailsRoom.maxSeat; i++) {
            const newSeat = await Seats.create({
              seatName: `${i}`,
              price,
              idRoom,
              idShowTime,
            });
            lstSeat.push(newSeat);
          }
          return lstSeat;
        };
        const lst = await createLstSeat(detailsRoom);
        res.status(201).send(lst);
      } else {
        res.status(403).send("Không có phòng trên");
      }
    } else {
      res.status(403).send("Lịch chiếu này đã có vé");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const update = async (req, res) => {
  const { idShowTime, price } = req.body;
  try {
    const lstSeat = await sequelize.query(
      `
            update seats set price  = ${price} where idShowTime = ${idShowTime}
        `,
      { type: QueryTypes.UPDATE }
    );
    res.status(200).send(lstSeat);
  } catch (error) {
    res.status(500).send(error);
  }
};
const details = async (req, res) => {
  const { idShowTime } = req.query;
  try {
    const seats = await sequelize.query(
      `
            select distinct price  from seats where idShowTime =${idShowTime}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).send(seats[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getByIdShowTime = async (req, res) => {
  const { id } = req.query;
  try {
    const film = await sequelize.query(
      `select films.id , nameFilm ,groupName, name as rapChieu,  trailer , imgFilm , description , rate , comingSoon , nowShowing , showDate
        from (((films
        inner join showtimes on films.id = showtimes.idFilm)
        inner join cinemas on cinemas.id = showtimes.idCinema)
        inner join groupcinemas on groupcinemas.id =  cinemas.idGroupCinema)
        where showtimes.id = ${id}`,
      { type: QueryTypes.SELECT }
    );

    const lstSeat = await sequelize.query(
      `
        select seats.id , keepSeat, seatName , price , bookded , seats.idRoom , idUser , idShowTime 
        from ((seats
        inner join showtimes on showtimes.id = seats.idShowTime)
        inner join rooms on rooms.id = showtimes.idRoom) 
        where showtimes.id = ${id} and  rooms.isActive = true`,
      { type: QueryTypes.SELECT }
    );
    const phongVe = {
      film: film[0],
      lstGhe: lstSeat,
    };
    res.status(200).send(phongVe);
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeKeepSeat = async (req, res) => {
  const { idSeat, idUser } = req.body;
  try {
    const _seat = await Seats.update(
      { keepSeat: idUser },
      {
        where: { id: idSeat },
      }
    );
    res.status(200).send(_seat);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  create,
  update,
  details,
  getByIdShowTime,
  changeKeepSeat,
};
