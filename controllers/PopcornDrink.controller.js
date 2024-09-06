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

// const { PopcornDrinks, Users, sequelize } = require("../models");
// const { QueryTypes } = require("sequelize");

// const createPopcornDrinkOrder = async (req, res, next) => {
//   const { user, popcornDrinkOrder } = req.body;
//   try {
//     const checkUser = await Users.findOne({
//       where: {
//         id: user.id,
//         isActive: true,
//       },
//     });
//     if (checkUser) {
//       let orderSuccess = [];
//       for (const order of popcornDrinkOrder) {
//         const newOrder = await PopcornDrinks.create({
//           userId: user.id,
//           comboName: order.comboName,
//           quantity: order.quantity,
//           price: order.price,
//         });
//         if (newOrder) {
//           await orderSuccess.push(newOrder);
//         }
//       }
//       req.orderSuccess = orderSuccess;
//       next();
//     } else {
//       res.status(400).send("Tài khoản tạm đã bị khóa");
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const getOrdersByUserId = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const orders = await PopcornDrinks.findAll({
//       where: {
//         userId: id,
//       },
//     });
//     res.status(200).send(orders);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const listOrdersWithUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     sequelize
//       .query(
//         `SELECT distinct orders.id as orderId, comboName, price, quantity, createdAt
//          FROM popcornDrinks AS orders
//          WHERE orders.userId = ${id}`,
//         { type: QueryTypes.SELECT }
//       )
//       .then((data) => {
//         res.status(200).send(data);
//       });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const getTotalRevenueByMonth = async (req, res) => {
//   try {
//     const year = req.query.year;
//     if (!year) {
//       return res.status(400).send({ message: "Year is required" });
//     }

//     let arr = [];
//     for (let index = 1; index <= 12; index++) {
//       const result = await sequelize.query(
//         `
//             SELECT SUM(price * quantity) as total
//             FROM popcornDrinks
//             WHERE MONTH(createdAt) = ${index} AND YEAR(createdAt) = ${year};
//         `,
//         { type: QueryTypes.SELECT }
//       );

//       let totalWithMonth = result[0];
//       if (totalWithMonth.total === null) {
//         totalWithMonth.total = 0;
//       }
//       arr = [...arr, totalWithMonth];
//     }

//     res.status(200).send(arr);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const getTotalRevenueByDay = async (req, res) => {
//   try {
//     const year = req.query.year;
//     const month = req.query.month;

//     if (!year || !month) {
//       return res.status(400).send({ message: "Year and month are required" });
//     }

//     let arr = [];
//     for (let day = 1; day <= 31; day++) {
//       const result = await sequelize.query(
//         `
//             SELECT SUM(price * quantity) as total
//             FROM popcornDrinks
//             WHERE DAY(createdAt) = ${day}
//             AND MONTH(createdAt) = ${month}
//             AND YEAR(createdAt) = ${year};
//         `,
//         { type: QueryTypes.SELECT }
//       );

//       let totalWithDay = result[0];
//       if (totalWithDay.total === null) {
//         totalWithDay.total = 0;
//       }
//       arr = [...arr, totalWithDay];
//     }

//     res.status(200).send(arr);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const getOrderCountByDay = async (req, res) => {
//   try {
//     const year = req.body.year;
//     const month = req.body.month;

//     if (!year || !month) {
//       return res.status(400).send({ message: "Year and month are required" });
//     }

//     let arr = [];
//     for (let day = 1; day <= 31; day++) {
//       const result = await sequelize.query(
//         `
//           SELECT COUNT(*) as orderCount
//           FROM popcornDrinks
//           WHERE DAY(createdAt) = ${day}
//           AND MONTH(createdAt) = ${month}
//           AND YEAR(createdAt) = ${year};
//         `,
//         { type: QueryTypes.SELECT }
//       );

//       let countWithDay = result[0];
//       if (countWithDay.orderCount === null) {
//         countWithDay.orderCount = 0;
//       }
//       arr = [...arr, countWithDay];
//     }

//     res.status(200).send(arr);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// module.exports = {
//   createPopcornDrinkOrder,
//   getOrdersByUserId,
//   listOrdersWithUser,
//   getTotalRevenueByMonth,
//   getTotalRevenueByDay,
//   getOrderCountByDay,
// };
