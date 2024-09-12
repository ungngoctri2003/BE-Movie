const { Combos, Users, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

// Tạo combo
const createCombo = async (req, res, next) => {
  const { user, listCombos, idShowTime } = req.body;
  try {
    const checkUser = await Users.findOne({
      where: {
        id: user.id,
        isActive: true,
      },
    });
    if (checkUser) {
      let comboSuccess = [];
      for (const combo of listCombos) {
        const combos = await Combos.findOne({ where: { id: combo.id } });
        const newCombo = await Combos.create({
          comboId: combo.id,
          comboName: combo.name,
          idUser: user.id,
          idShowTime: idShowTime,
          price: combo.price,
          quantity: combo.quantity,
          popcornDrinkId: combo.id,
        });
        if (newCombo) {
          combos.idUser = user.id;
          await combos.save();
          await comboSuccess.push(newCombo);
        }
      }
      req.comboSuccess = comboSuccess;
      next();
    } else {
      res.status(400).send("Tài khoản tạm đã bị khóa");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lấy thông tin combo theo người dùng
const getComboByIdUser = async (req, res) => {
  const { id } = req.params;
  try {
    const lstCombo = await Combos.findAll({
      where: {
        userId: id,
      },
    });
    res.status(200).send(lstCombo);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Lấy danh sách combo
const listComboWithUser = async (req, res) => {
  const { id } = req.params; // Lấy id của user từ URL
  try {
    // Truy vấn danh sách combo theo user
    const combos = await sequelize.query(
      `SELECT combos.id as comboId, combos.comboName, combos.price, combos.quantity, combos.createdAt, 
              showtimes.*, films.nameFilm as nameFilm, popcornDrinks.imageUrl as comboImage
       FROM Combos
       INNER JOIN showtimes ON Combos.idShowTime = showtimes.id
       INNER JOIN films ON showtimes.idFilm = films.id
       LEFT JOIN PopcornDrinks ON Combos.popcornDrinkId = PopcornDrinks.id
       WHERE Combos.idUser = ${id} AND Combos.isActive = true`,
      { type: QueryTypes.SELECT }
    );

    // Trả về danh sách combo
    res.status(200).send(combos);
  } catch (error) {
    // Xử lý lỗi
    res.status(500).send(error);
  }
};

// Lấy tổng giá trị combo theo tháng
const getTotalComboWithMonth = async (req, res) => {
  try {
    const year = req.query.year;

    if (!year) {
      return res.status(400).send({ message: "Year is required" });
    }

    let arr = [];
    for (let index = 1; index <= 12; index++) {
      const result = await sequelize.query(
        `
            SELECT SUM(price * quantity) as total 
            FROM combos 
            WHERE MONTH(createdAt) = ${index} AND YEAR(createdAt) = ${year};
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

// Lấy tổng giá trị combo theo ngày
const getTotalComboWithDay = async (req, res) => {
  try {
    const year = req.query.year;
    const month = req.query.month;

    if (!year || !month) {
      return res.status(400).send({ message: "Year and month are required" });
    }

    let arr = [];

    for (let day = 1; day <= 31; day++) {
      const result = await sequelize.query(
        `
            SELECT SUM(price * quantity) as total 
            FROM combos 
            WHERE DAY(createdAt) = ${day} 
            AND MONTH(createdAt) = ${month} 
            AND YEAR(createdAt) = ${year};
        `,
        { type: QueryTypes.SELECT }
      );

      let totalWithDay = result[0];
      if (totalWithDay.total === null) {
        totalWithDay.total = 0;
      }
      arr = [...arr, totalWithDay];
    }

    res.status(200).send(arr);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Đếm số lượng combo theo ngày
const getComboByDay = async (req, res) => {
  try {
    const { year, month, day } = req.body;

    // Kiểm tra xem year, month và day có được cung cấp không
    if (!year || !month || !day) {
      return res
        .status(400)
        .send({ message: "Year, month, and day are required" });
    }

    // Truy vấn lấy tất cả các combo trong ngày cụ thể
    const combos = await sequelize.query(
      `
          SELECT c.*, u.userName AS userName, films.nameFilm AS nameFilm
        FROM combos c
        JOIN users u ON c.idUser = u.id
        JOIN showtimes s ON c.idShowTime = s.id
        JOIN films ON s.idFilm = films.id
         WHERE DAY(c.createdAt) = :day 
        AND MONTH(c.createdAt) = :month 
        AND YEAR(c.createdAt) = :year;
      `,
      {
        replacements: { day, month, year },
        type: QueryTypes.SELECT,
      }
    );

    // Tính tổng số tiền từ các combo trong ngày đó
    const totalAmount = combos.reduce((sum, combo) => {
      // Chuyển giá thành số
      const price = parseFloat(combo.price) || 0;
      return sum + price * combo.quantity;
    }, 0);

    // Gửi phản hồi với danh sách combo và tổng tiền
    res.status(200).send({
      combos,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching combos by day:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

module.exports = {
  createCombo,
  getComboByIdUser,
  getTotalComboWithMonth,
  getTotalComboWithDay,
  getComboByDay,
  listComboWithUser,
};
