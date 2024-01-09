const { GroupCinemas, Cinemas } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  const { file, body } = req;
  const { idGroupCinema, name, address } = body;
  try {
    if (file?.path) {
      const logo = await file.path.replace(/\\/g, "/");
      const newCinema = await Cinemas.create({
        idGroupCinema,
        name,
        address,
        logo,
      });
      res.status(201).send({
        message: "Thêm  rạp thành công",
        data: newCinema,
      });
    } else {
      res.status(403).send("Bạn cần chọn ảnh để thêm  rạp chiếu");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAll = async (req, res) => {
  const { tenRap } = req.query;
  try {
    let lstCinemas;
    if (tenRap) {
      lstCinemas = await Cinemas.findAll({
        where: {
          name: {
            [Op.like]: `%${tenRap}%`,
          },
          isActive: true,
        },
        include: [
          {
            model: GroupCinemas,
            as: "group",
          },
        ],
      });
    } else {
      lstCinemas = await Cinemas.findAll({
        where: {
          isActive: true,
        },
        include: [
          {
            model: GroupCinemas,
            as: "group",
          },
        ],
      });
    }
    lstCinemas.forEach((element) => {
      element.idGroupCinema = undefined;
    });
    res.status(200).send(lstCinemas);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAllByIdGroupCinema = async (req, res) => {
  const { id } = req.params;
  try {
    const lstCinemas = await Cinemas.findAll({
      where: {
        idGroupCinema: id,
        isActive: true,
      },
      include: [
        {
          model: GroupCinemas,
          as: "group",
        },
      ],
    });
    lstCinemas.forEach((element) => {
      element.idGroupCinema = undefined;
    });
    res.status(200).send(lstCinemas);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const cinemas = await Cinemas.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: GroupCinemas,
          as: "group",
        },
      ],
    });
    cinemas.idGroupCinema = undefined;
    res.status(200).send(cinemas);
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteCinemas = async (req, res) => {
  const { details } = req;
  try {
    details.idGroupCinema = undefined;
    details.isActive = false;
    await details.save();
    res.status(200).send(details);
  } catch (error) {
    res.status(500).send(error);
  }
};
const update = async (req, res) => {
  const { file, body } = req;
  const { id } = req.params;
  const { idGroupCinema, name, address } = body;
  try {
    const cinemaUpdate = req.details;
    let logo;
    if (!file) {
      logo = cinemaUpdate.logo;
    } else {
      logo = file.path.replace(/\\/g, "/");
    }
    cinemaUpdate.idGroupCinema = idGroupCinema;
    cinemaUpdate.name = name;
    cinemaUpdate.address = address;
    cinemaUpdate.logo = logo;
    await cinemaUpdate.save();
    const updated = await Cinemas.findOne({
      where: {
        id,
      },
      include: [
        {
          model: GroupCinemas,
          as: "group",
        },
      ],
    });
    updated.idGroupCinema = undefined;
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
  deleteCinemas,
  update,
  getAllByIdGroupCinema,
};
