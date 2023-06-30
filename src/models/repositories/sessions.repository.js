const { SESSION_KEY } = require("../../config/env.config");
const { HttpError, HTTP_STATUS } = require("../../utils/api.utils");
const { isValidPassword, hashPassword } = require("../../utils/hash.utils");
const { generateToken } = require("../../utils/jwt.utils");
const { getDAOS } = require("../daos/daosFactory");
const { CurrentUserDTO } = require("../dtos/users.dto");

const { usersDao } = getDAOS();

class SessionsRepository {
  async register(res, first_name, last_name, age, email, password) {
    const user = await usersDao.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: "User already exist" });
    }

    const cartForNewUser = await cartsDao.addCart();

    const newUser = {
      first_name,
      last_name,
      age,
      email,
      password: hashPassword(password),
      cart: cartForNewUser._id,
    };
    const createdUser = await usersDao.createdUser(newUser);

    const userForCookie = {
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      age: createdUser.age,
      email: createdUser.email,
      cart: createdUser.cart,
      role: createdUser.role,
    };

    const access_token = generateToken(userForCookie);
    res.cookie(SESSION_KEY, access_token, {
      maxAge: 60 * 60 * 60 * 24 * 1000,
      httpOnly: true,
    });
  }

  async login(res, email, password) {
    const user = await usersDao.getUserByEmail(email);
    if (!user || !isValidPassword(user, password)) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Wrong email or password");
    }
    const userForCookie = {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      cart: user.cart,
      role: user.role,
    };
    const access_token = generateToken(userForCookie);

     res.cookie(SESSION_KEY, access_token, {
      maxAge: 60 * 60 * 60 * 24 * 1000,
      httpOnly: true,
    });
  }

  async loginGithub(res, user) {
    const access_token = generateToken(user);
    return res.cookie(SESSION_KEY, access_token, {
      maxAge: 60 * 60 * 60 * 24 * 1000,
      httpOnly: true,
    });
  }

  async logOutSession(res) {
    return res.clearCookie(SESSION_KEY);
  }

  async getUserSession(req) {
    const currentUser = new CurrentUserDTO(req.user);
    return currentUser;
  }
}

module.exports = new SessionsRepository();
