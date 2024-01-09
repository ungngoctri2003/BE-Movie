const { Users, TypeUser, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const gravatarUrl = require("gravatar-url");
var jwt = require("jsonwebtoken");
const { compareBcrypt } = require("../middleware/Bcrypt");
// lấy loại người dùng từ bảng TypeUser
const getTypeUser = async (id) => {
  const user_type = await TypeUser.findOne({ where: { id } });
  return user_type;
};
///-----
const signUp = async (req, res, next) => {
  const { userName, password, email, phoneNumber, typeUser } = req.body;
  try {
    const checkUser = await Users.findOne({ where: { email } });
    if (!checkUser) {
      let type = 1;
      if (typeUser) {
        type = typeUser;
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const avatarUrl = gravatarUrl(email);
      const newUser = await Users.create({
        userName,
        password: hashPassword,
        email,
        phoneNumber,
        typeUser: type,
        avatar: avatarUrl,
      });
      req.userRegister = newUser;
      next();
    } else {
      res.status(200).send({
        notify: "EMAIL_EXISTS",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await Users.findOne({ where: { email } });
    if (checkUser) {
      if (checkUser.isActive) {
        if (!checkUser.isBlock) {
          if (bcrypt.compareSync(password, checkUser.password)) {
            {
              const user_type = await getTypeUser(checkUser.typeUser);
              const token = jwt.sign(
                { email: email, type: user_type.type },
                "secret"
              );
              checkUser.typeUser = user_type;
              checkUser.password = undefined;
              res.status(200).send({
                notify: "SUCCESS",
                user: {
                  token,
                  userLogin: checkUser,
                },
              });
            }
          } else {
            res.status(200).send({
              notify: "PASSWORD_ERROR",
            });
          }
        } else {
          res.status(200).send({
            notify: "LOCKED",
          });
        }
      } else {
        res.status(404).send("EMAIL không hoạt động ");
      }
    } else {
      res.status(200).send({
        notify: "EMAIL_NOT_FOUND",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateUser = async (req, res) => {
  const { userName, password, phoneNumber, typeUser, avatar } = req.body;
  const { file } = req;
  try {
    const userUpdate = req.details;
    //fnc
    const update = async (
      userName = userUpdate.userName,
      phoneNumber = userUpdate.phoneNumber,
      avatar = userUpdate.avatar,
      typeUser = userUpdate.typeUser,
      password = userUpdate.password
    ) => {
      userUpdate.userName = userName;
      userUpdate.password = password;
      userUpdate.phoneNumber = phoneNumber;
      userUpdate.typeUser = typeUser;
      if (file?.path) {
        userUpdate.avatar = `${file.path}`;
      } else {
        userUpdate.avatar = avatar;
      }
      await userUpdate.save();
      return userUpdate;
    };
    //end fnc
    if (req.user.type === "SUPPER_ADMIN") {
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const updated = await update(
          userName,
          phoneNumber,
          avatar,
          typeUser,
          hashPassword
        );
        res.status(200).send(updated);
      } else {
        const updated = await update(
          userName,
          phoneNumber,
          avatar,
          typeUser,
          password
        );
        res.status(200).send(updated);
      }
    } else {
      if (req.user.email === userUpdate.email) {
        if (password) {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          const updated = await update(
            userName,
            phoneNumber,
            avatar,
            typeUser,
            hashPassword
          );
          res.status(200).send(updated);
        } else {
          if (typeUser == 3) {
            res.status(400).send("NOT SUPPER_ADMIN");
          } else {
            const updated = await update(
              userName,
              phoneNumber,
              avatar,
              typeUser,
              hashPassword
            );
            res.status(200).send(updated);
          }
        }
      } else {
        res.status(403).send("Bạn không phải người sở hữu tài khoản này");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAllUser = async (req, res) => {
  const { name } = req.query;
  try {
    let listUser;
    if (name) {
      listUser = await Users.findAll({
        where: {
          userName: {
            [Op.like]: `%${name}%`,
          },
          isActive: true,
        },
        include: [
          {
            model: TypeUser,
            as: "type_user",
          },
        ],
      });
    } else {
      listUser = await Users.findAll({
        where: {
          isActive: true,
        },
        include: [
          {
            model: TypeUser,
            as: "type_user",
          },
        ],
      });
    }
    listUser.forEach((element) => {
      element.password = undefined;
      element.typeUser = undefined;
    });
    res.status(200).send(listUser);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getDetailsUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDetails = await Users.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: TypeUser,
          as: "type_user",
        },
      ],
    });
    userDetails.typeUser = undefined;
    userDetails.password = undefined;
    res.status(200).send(userDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getUserWithShowTimeID = async (req, res) => {
  const { id } = req.query;
  try {
    sequelize
      .query(
        `
            select distinct users.id as userId, userName , email , phoneNumber, count(*) as numberTicket 
            from (seats
            inner join users on users.id = seats.idUser)
            where seats.idShowTime = ${id}
            group by idUser;
        `,
        { type: QueryTypes.SELECT }
      )
      .then(async (data) => {
        let hacks = [];
        for (const user of data) {
          const listSeat = await sequelize.query(
            `select distinct seatName
                from (seats
                inner join users on users.id = seats.idUser)
                where seats.idShowTime = ${id} and seats.idUser = ${user.userId}`,
            { type: QueryTypes.SELECT }
          );
          user.listSeat = listSeat.map((seat) => {
            return seat.seatName;
          });
          hacks = [...hacks, user];
        }
        res.status(200).send(hacks);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const userDelete = req.details;
    userDelete.isActive = false;
    await userDelete.save();
    userDelete.password = undefined;
    res.status(200).send({
      message: "Xóa thành công ",
      data: userDelete,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
const BlockAndUnBlock = async (req, res) => {
  const { id } = req.params;
  const { isBlock } = req.body;
  try {
    const details = await Users.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    details.isBlock = isBlock;
    await details.save();
    res.status(200).send(details);
  } catch (error) {
    res.status(500).send(error);
  }
};
const sendVerify = async (req, res, next) => {
  const { email } = req.body;
  try {
    const checkUser = await Users.findOne({ where: { email } });
    req.userRegister = checkUser;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};
const verifyEmail = async (req, res) => {
  const { email, id } = req.query;
  try {
    const userVerify = await Users.findOne({ where: { id } });
    if (userVerify.isVerify) {
      res
        .status(200)
        .send(`Email ${userVerify.email} của bạn đã được xác minh từ trước đó`);
    }
    if (compareBcrypt(userVerify.email, email)) {
      userVerify.isVerify = true;
      await userVerify.save();
    }
    res.status(200).send(`Email ${userVerify.email} của bạn đã được xác minh`);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  verifyEmail,
  sendVerify,
  signUp,
  signIn,
  updateUser,
  getAllUser,
  getDetailsUser,
  deleteUser,
  BlockAndUnBlock,
  getUserWithShowTimeID,
};
