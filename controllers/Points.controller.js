const { Transactions, Users, sequelize } = require("../models");

const addPointsAfterPayment = async (req, res) => {
  const { user, totalAmount, pointsToUse } = req.body;
  console.log("check body: ", req.body);
  try {
    // Kiểm tra người dùng
    const checkUser = await Users.findOne({
      where: { id: user.id, isActive: true },
    });

    if (!checkUser) {
      return res
        .status(400)
        .send("Người dùng không hợp lệ hoặc không hoạt động.");
    }
    console.log("check user: ", checkUser);

    // Tính số điểm thêm vào (ví dụ: 1 điểm cho mỗi đô la)
    const pointsToAdd = Math.floor(totalAmount / 10);

    // Cập nhật điểm cho người dùng sau khi cộng điểm
    const updatedPoints = (checkUser.points || 0) + pointsToAdd;

    // Trừ điểm cho người dùng nếu có điểm sử dụng
    let finalPoints = updatedPoints;
    if (pointsToUse) {
      // Kiểm tra số điểm đủ để sử dụng không
      if (pointsToUse > finalPoints) {
        return res
          .status(400)
          .send("Số điểm sử dụng vượt quá số điểm hiện có.");
      }

      // Trừ điểm
      finalPoints -= pointsToUse;

      // Ghi nhận giao dịch trừ điểm
      await Transactions.create({
        userId: user.id,
        pointsUsed: pointsToUse,
        transactionType: "Points deduction after payment",
      });
    }

    // Tạo giao dịch cho số điểm thêm vào
    const newTransaction = await Transactions.create({
      userId: user.id,
      pointsAdded: pointsToAdd,
      transactionType: "Payment for popcorn drink",
    });

    // Cập nhật điểm cho người dùng
    await Users.update({ points: finalPoints }, { where: { id: user.id } });

    // Trả về phản hồi thành công
    res.status(200).json({
      message: "Điểm đã được cộng và trừ thành công.",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi xử lý điểm.");
  }
};

module.exports = {
  addPointsAfterPayment,
};
