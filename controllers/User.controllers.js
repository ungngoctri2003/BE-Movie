const { Users, TypeUser, sequelize, PasswordResets } = require("../models");
const { sendMail } = require("../middleware/nodoMailer");
const { Op, QueryTypes, where } = require("sequelize");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const gravatarUrl = require("gravatar-url");
var jwt = require("jsonwebtoken");
const { compareBcrypt, generateBcrypt } = require("../middleware/Bcrypt");
// lấy loại người dùng từ bảng TypeUser
const getTypeUser = async (id) => {
  const user_type = await TypeUser.findOne({ where: { id } });
  return user_type;
};
///-----
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem email có tồn tại trong hệ thống hay không
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    // Kiểm tra xem PasswordResets đã được định nghĩa và được kết nối đến cơ sở dữ liệu
    if (!PasswordResets) {
      return res.status(500).json({
        message:
          "Mô hình PasswordResets không được định nghĩa hoặc kết nối đến cơ sở dữ liệu",
      });
    }
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    // Tạo token cho việc reset password
    const resetToken = "generatethisusingyourtokenalgorithm";

    // Lưu token vào database
    await PasswordResets.create({
      userId: user.id,
      resetToken,
    });
    console.log(email);
    // Gửi email với link reset password
    const resetLink = `http://localhost:3000/resetPassword/${resetToken}`;
    const mailOptions = {
      to: email,
      subject: "Yêu cầu Reset Mật Khẩu",
      html: `Click vào đây để reset mật khẩu: <a href="${resetLink}">${resetLink}</a>`,
    };
    await sendMail(mailOptions);

    return res.json({ message: "Email reset mật khẩu đã được gửi" });
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async (req, res, next) => {
  const { body } = req;
  const { email } = body;
  try {
    const checkUser = await Users.findOne({
      where: { email },
    });

    if (!checkUser) {
      res.status(400).send("Email is not exist");
    }
    // step 1 create new passsworrd
    const newPassword = uuid.v4();
    // step2 ma hoa passsowd

    const generatePass = generateBcrypt(newPassword);

    //step 3 save pass in step 2 with checkUser
    checkUser.password = generatePass;
    await checkUser.save();

    // step 4 send mail with passs in step 2
    req.password = newPassword;
    next();
    // login with passs in  step 1
  } catch (error) {
    res.status(500).send(error);
  }
};

// Hàm này sẽ reset mật khẩu dựa trên token
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    // Tìm token trong database
    const resetRecord = await PasswordResets.findOne({
      where: { resetToken },
      include: Users,
    });

    // Kiểm tra xem token có hợp lệ hay không
    if (
      !resetRecord ||
      resetRecord.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Cập nhật mật khẩu cho người dùng
    resetRecord.User.password = newPassword;
    await resetRecord.User.save();

    // Xóa token khỏi database
    await resetRecord.destroy();

    return res.json({ message: "Mật khẩu đã được reset thành công" });
  } catch (error) {
    next(error);
  }
};

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
  const { userName, password, phoneNumber, typeUser, avatar, points } =
    req.body; // Thêm 'points'
  const { file } = req;

  try {
    const userUpdate = req.details;

    // Function update
    const update = async (
      userName = userUpdate.userName,
      phoneNumber = userUpdate.phoneNumber,
      avatar = userUpdate.avatar,
      typeUser = userUpdate.typeUser,
      password = userUpdate.password,
      points = userUpdate.points // Thêm 'points' với giá trị mặc định
    ) => {
      userUpdate.userName = userName;
      userUpdate.password = password;
      userUpdate.phoneNumber = phoneNumber;
      userUpdate.typeUser = typeUser;
      userUpdate.points = points; // Cập nhật trường 'points'
      if (file?.path) {
        userUpdate.avatar = `${file.path}`;
      } else {
        userUpdate.avatar = avatar;
      }
      await userUpdate.save();
      return userUpdate;
    };

    const user_type = await getTypeUser(typeUser);

    if (req.user.type === "SUPPER_ADMIN") {
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const updated = await update(
          userName,
          phoneNumber,
          avatar,
          typeUser,
          hashPassword,
          points // Thêm 'points' khi update
        );

        const dataSend = { ...updated.dataValues, typeUser: user_type };

        res.status(200).send(dataSend);
      } else {
        const updated = await update(
          userName,
          phoneNumber,
          avatar,
          typeUser,
          password,
          points // Thêm 'points' khi update
        );
        console.log(updated);

        const dataSend = { ...updated.dataValues, typeUser: user_type };

        res.status(200).send(dataSend);
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
            hashPassword,
            points // Thêm 'points' khi update
          );
          console.log("a", updated);
          const dataSend = { ...updated.dataValues, typeUser: user_type };

          res.status(200).send(dataSend);
        } else {
          if (typeUser == 3) {
            res.status(400).send("NOT SUPPER_ADMIN");
          } else {
            const updated = await update(
              userName,
              phoneNumber,
              avatar,
              typeUser,
              password,
              points // Thêm 'points' khi update
            );

            const dataSend = { ...updated.dataValues, typeUser: user_type };

            res.status(200).send(dataSend);
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
  requestPasswordReset,
  resetPassword,
  forgotPassword,
};
