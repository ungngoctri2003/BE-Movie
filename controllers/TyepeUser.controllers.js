const { TypeUser } = require("../models");

const createTypeUser = async (req, res) => {
  const { nameType, type } = req.body;
  try {
    const checkType = await TypeUser.findOne({
      where: {
        type,
      },
    });
    if (!checkType) {
      const newType = await TypeUser.create({ nameType, type });
      res.status(201).send(newType);
    } else {
      res.status(403).send("Loại người dùng đã tồn tại ");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAll = async (req, res) => {
  try {
    const listUserType = await TypeUser.findAll({
      where: {
        isActive: true,
      },
    });
    res.status(200).send(listUserType);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const details = await TypeUser.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    if (details) {
      res.status(200).send(details);
    } else {
      res.status(404).send(`Not Found ID =${id} `);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteTypeUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (id == 1 || id == 2 || id == 3) {
      res.status(403).send("Bạn Không được xóa Loại Người Dùng này");
    }
    const typeDelete = req.details;
    typeDelete.isActive = false;
    await typeDelete.save();
    res.status(200).send(typeDelete);
  } catch (error) {
    res.status(500).send(error);
  }
};
const update = async (req, res) => {
  const { nameType, type } = req.body;
  try {
    const typeUserUpdate = req.details;
    if (
      typeUserUpdate.id == 1 ||
      typeUserUpdate.id == 2 ||
      typeUserUpdate.id == 3
    ) {
      res.status(403).send("Bạn Không được cập nhật Loại Người Dùng này");
    }
    typeUserUpdate.nameType = nameType;
    typeUserUpdate.type = type;
    await typeUserUpdate.save();
    res.status(200).send(typeUserUpdate);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  createTypeUser,
  getAll,
  getDetails,
  deleteTypeUser,
  update,
};
