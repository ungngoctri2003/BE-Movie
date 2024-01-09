const { Users } = require("../../models");
const Verify_Account = async (req, res, next) => {
  const { user } = req;
  try {
    const userVerify = await Users.findOne({ where: { email: user.email } });
    if (!userVerify.isVerify) {
      res.status(200).send({
        mess: "EMAIL_NOT_VERIFY",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  Verify_Account,
};
