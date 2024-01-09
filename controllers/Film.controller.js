const { Op } = require("sequelize");
const { Films, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const create = async (req, res) => {
  const { file, body } = req;
  const {
    nameFilm,
    trailer,
    description,
    showtime,
    rate,
    comingSoon,
    actor,
    nowShowing,
  } = body;
  try {
    if (file?.path) {
      const imgFilm = await file.path.replace(/\\/g, "/");
      const newFilm = await Films.create({
        nameFilm,
        showtime,
        imgFilm,
        trailer,
        description,
        rate,
        comingSoon,
        nowShowing,
        actor,
      });
      res.status(201).send({
        message: "Thêm Phim thành công",
        data: newFilm,
      });
    } else {
      res.status(403).send("Bạn cần gửi ảnh lên để thêm phim");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAll = async (req, res) => {
  const { name } = req.query;
  try {
    let listFilm;
    if (name) {
      listFilm = await Films.findAll({
        where: {
          nameFilm: {
            [Op.like]: `%${name}%`,
          },
          isActive: true,
        },
      });
    } else {
      listFilm = await Films.findAll({ where: { isActive: true } });
    }
    res.status(200).send(listFilm);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getDetails = async (req, res) => {
  try {
    res.status(200).send(req.details);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFilmByIDCinema = async (req, res) => {
  const { id } = req.params;
  try {
    sequelize
      .query(
        `
            select distinct  films.id as idFilm,  films.nameFilm , films.imgFilm 
            from films 
            inner join showtimes on films.id = showtimes.idFilm
            where showtimes.idCinema = ${id}`,
        { type: QueryTypes.SELECT }
      )
      .then(async (data) => {
        let hacks = [];
        for (const d of data) {
          const lstShowDate = await sequelize.query(
            `select showtimes.id,  showDate
                    from showtimes 
                    inner join films on films.id = showtimes.idFilm
                    inner join cinemas on cinemas.id = showtimes.idCinema
                    where cinemas.id = ${id} and films.id = ${d.idFilm}`,
            { type: QueryTypes.SELECT }
          );
          d.lstShowDate = lstShowDate;
          hacks = [...hacks, d];
        }
        res.status(200).send(hacks);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteFilm = async (req, res) => {
  try {
    const filmDel = req.details;
    filmDel.isActive = false;
    await filmDel.save();
    res.status(200).send(filmDel);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateFilm = async (req, res) => {
  const { file, body } = req;
  const {
    nameFilm,
    trailer,
    description,
    showtime,
    rate,
    actor,
    comingSoon,
    nowShowing,
  } = body;
  try {
    const filmUpdate = req.details;
    let imgFilm;
    if (!file) {
      imgFilm = filmUpdate.imgFilm;
    } else {
      imgFilm = file.path.replace(/\\/g, "/");
    }
    filmUpdate.nameFilm = nameFilm;
    filmUpdate.trailer = trailer;
    filmUpdate.description = description;
    filmUpdate.rate = rate;
    filmUpdate.showtime = showtime;
    filmUpdate.comingSoon = comingSoon;
    filmUpdate.nowShowing = nowShowing;
    filmUpdate.imgFilm = imgFilm;
    filmUpdate.actor = actor;
    await filmUpdate.save();
    res.status(200).send({
      message: "Cập nhập Phim thành công",
      data: filmUpdate,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  create,
  getAll,
  getDetails,
  deleteFilm,
  updateFilm,
  getFilmByIDCinema,
};
