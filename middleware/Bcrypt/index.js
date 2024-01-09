const bcrypt = require("bcryptjs");

const generateBcrypt = (input) => {
  const salt = bcrypt.genSaltSync(10);
  const hashInput = bcrypt.hashSync(input, salt);
  return hashInput;
};

const compareBcrypt = (input, data_in_database) => {
  return bcrypt.compareSync(input, data_in_database);
};

module.exports = {
  generateBcrypt,
  compareBcrypt,
};
