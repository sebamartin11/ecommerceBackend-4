const { HttpError, HTTP_STATUS } = require("../../utils/api.utils");
const { SECRET_KEY } = require("../../config/env.config");
const jwt = require("jsonwebtoken");
const { hashPassword, isValidPassword } = require("../../utils/hash.utils");
const { getDAOS } = require("../daos/daosFactory");
const { getServices } = require("../../services/app.service");

const { usersDao, cartsDao } = getDAOS();
const { messagesService } = getServices();

class UsersRepository {
  async getUsers() {
    const users = await usersDao.getUsers();
    return users;
  }

  async getUserById(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing param");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  async getUserByEmail(email) {
    if (!email) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing param");
    }
    const user = await usersDao.getUserByEmail(email);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  async createUser(payload) {
    const { first_name, last_name, age, email, password, cart } = payload;
    if (!first_name || !last_name || !age || !email || !password) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing fields");
    }
    const user = await usersDao.getUserByEmail(email);
    if (user) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "User already exist");
    }

    const cartForNewUser = await cartsDao.addCart();

    const newUserPayload = {
      first_name,
      last_name,
      age,
      email,
      password: hashPassword(password),
      cart: cartForNewUser,
      role: "user",
    };

    const newUser = await usersDao.createUser(newUserPayload);
    return newUser;
  }

  async updateUser(payload, email) {
    if (!email) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing data from user");
    }
    const user = await usersDao.getUserByEmail(email);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const updatedUser = await usersDao.updateUserByEmail(payload, email);
    return updatedUser;
  }

  async isResetPasswordTokenExpired(token) {
    const payloadToken = jwt.verify(token, SECRET_KEY);
    const tokenExpiration = payloadToken.exp;
    const now = Math.floor(Date.now() / 1000);

    const isTokenExpired = now > tokenExpiration ? true : false;

    return isTokenExpired;
  }

  async resetPasswordEmail(req) {
    const sendResetPasswordEmail = await messagesService.resetPasswordEmail(
      req
    );
    return sendResetPasswordEmail;
  }

  async setNewPassword(password, token) {
    const payloadToken = jwt.verify(token, SECRET_KEY);
    const email = payloadToken.email;

    if (!email || !payloadToken) {
      throw new HttpError(HTTP_STATUS.INVALID_TOKEN, "Invalid token");
    }

    const user = await usersDao.getUserByEmail(email);

    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (isValidPassword(user, password)) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "New password cannot be the same as the old one"
      );
    }

    const hashNewPassword = hashPassword(password);

    const updatedUser = await usersDao.updateUserByEmail(email, {
      password: hashNewPassword,
    });
    return updatedUser;
  }

  async updateUserRole(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide a valid ID");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    let newRole;
    if (user.role === "user") {
      newRole = "premium";
    } else if (user.role === "premium") {
      newRole = "user";
    }

    const updatedUser = await usersDao.updateUserById(uid, { role: newRole });
    return updatedUser;
  }

  async deleteUser(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide an id");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    const deletedUser = await usersDao.deleteUser(uid);
    return deletedUser;
  }
}

module.exports = new UsersRepository();
