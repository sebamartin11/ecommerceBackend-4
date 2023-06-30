const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");

const sessionsRepository = require("../models/repositories/sessions.repository");

class SessionsController {
  static async register(req, res, next) {
    const { first_name, last_name, age, email, password } = req.body;
    try {
      const registerUser = await sessionsRepository.register(
        res,
        first_name,
        last_name,
        age,
        email,
        password
      );
      const response = apiSuccessResponse("User registered successfully!");
      return res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const loginUser = await sessionsRepository.login(res, email, password);
      const response = apiSuccessResponse("User logued in successfully!");
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async loginGithub(req, res, next) {
    const user = req.user;
    try {
      const gitHubUser = await sessionsRepository.loginGithub(res, user);
      const response = apiSuccessResponse(
        "User logued in successfully with github!"
      );
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logOut(req, res, next) {
    try {
      const clearCookie = await sessionsRepository.logOutSession(res);
      const response = apiSuccessResponse("Session close");
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async currentSession(req, res, next) {
    try {
      const currentUser = await sessionsRepository.getUserSession(req);
      const response = apiSuccessResponse(currentUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SessionsController;
