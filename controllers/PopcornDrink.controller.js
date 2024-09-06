// controllers/PopcornDrink.controller.js
const { PopcornDrinks } = require("../models");
const { Op } = require("sequelize");
const create = async (req, res) => {
  const { file, body } = req;
  const { name, price, description } = body;
  try {
    if (file?.path) {
      const imageUrl = await file.path.replace(/\\/g, "/");
      const newPopcornDrink = await PopcornDrinks.create({
        name,
        price,
        description,
        imageUrl,
      });
      res.status(201).send({
        message: "Thêm combo bỏng nước thành công",
        data: newPopcornDrink,
      });
    } else {
      res.status(403).send("Bạn cần gửi thêm ảnh để thêm bỏng nước");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAll = async (req, res) => {
  const { name } = req.query;
  try {
    let lstCombs;
    if (name) {
      lstCombs = await PopcornDrinks.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
    } else {
      lstCombs = await PopcornDrinks.findAll({});
    }

    res.status(200).send(lstCombs);
  } catch (error) {
    console.error(error); // Ghi lại lỗi vào console
    res.status(500).send({ error: "Đã xảy ra lỗi khi lấy dữ liệu" });
  }
};

const getDetails = async (req, res) => {
  try {
    res.status(200).send(req.details);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCombo = async (req, res) => {
  try {
    const combo = req.details;
    await combo.destroy();
    res.status(200).send({
      message: "Xóa combo bỏng nước thành công",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const update = async (req, res) => {
  const { file, body, details } = req;
  const { name, price, description } = body;
  try {
    let imageUrl = details.imageUrl;
    if (file) {
      imageUrl = file.path.replace(/\\/g, "/");
    }
    details.name = name;
    details.price = price;
    details.description = description;
    details.imageUrl = imageUrl;
    await details.save();
    res.status(200).send({
      message: "Cập nhật combo bỏng nước thành công",
      data: details,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  create,
  getAll,
  getDetails,
  deleteCombo,
  update,
};
