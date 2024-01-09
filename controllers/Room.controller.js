const { Rooms, Cinemas } = require("../models");
const { Op } = require("sequelize");
const create = async (req, res) => {
  const { roomName, idCinema, maxSeat, size } = req.body;
  try {
    const newRoom = await Rooms.create({ roomName, idCinema, maxSeat, size });
    res.status(201).send(newRoom);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAll = async (req, res) => {
  const { name } = req.query;
  try {
    let lstRoom;
    if (name) {
      lstRoom = await Rooms.findAll({
        where: {
          roomName: {
            [Op.like]: `%${name}%`,
          },
          isActive: true,
        },
        include: [
          {
            model: Cinemas,
            as: "cinema_room",
          },
        ],
      });
    } else {
      lstRoom = await Rooms.findAll({
        where: {
          isActive: true,
        },
        include: [
          {
            model: Cinemas,
            as: "cinema_room",
          },
        ],
      });
    }
    lstRoom.forEach((element) => {
      element.idCinema = undefined;
    });
    res.status(200).send(lstRoom);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getRoomByIDCinema = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Rooms.findAll({
      where: {
        idCinema: id,
        isActive: true,
      },
      include: [
        {
          model: Cinemas,
          as: "cinema_room",
        },
      ],
    });
    result.forEach((element) => {
      element.idCinema = undefined;
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const roomDetails = await Rooms.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Cinemas,
          as: "cinema_room",
        },
      ],
    });
    roomDetails.idCinema = undefined;
    res.status(200).send(roomDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const roomDetails = await Rooms.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: Cinemas,
          as: "cinema_room",
        },
      ],
    });
    roomDetails.isActive = false;
    await roomDetails.save();
    res.status(200).send(roomDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};
const update = async (req, res) => {
  const { id } = req.params;
  const { roomName, idCinema, maxSeat, size } = req.body;
  try {
    const details = req.details;
    details.roomName = roomName;
    details.idCinema = idCinema;
    details.maxSeat = maxSeat;
    details.size = size;
    await details.save();
    const updated = await Rooms.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Cinemas,
          as: "cinema_room",
        },
      ],
    });
    res.status(200).send({
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  create,
  getAll,
  getDetails,
  deleteRoom,
  update,
  getRoomByIDCinema,
};
