//bcrypt
const bcrypt = require("bcrypt");

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //if no value is assign, by default is 10

const isValidPassword = (userDB, password) =>
  bcrypt.compareSync(password, userDB.password); //return true or false. Client input info vs db info

module.exports = {
  hashPassword,
  isValidPassword,
};
