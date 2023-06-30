const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");
const { logger } = require("../logger/logger");

const cartsRepository = require("../models/repositories/carts.repository");

class CartsController {
  //CREATE cart
  static async addCart(req, res, next) {
    try {
      let result = await cartsRepository.addCart();
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET all carts
  static async getCarts(req, res, next) {
    try {
      const result = await cartsRepository.getAllCarts();
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET cart by id
  static async getCartById(req, res, next) {
    const cid = req.params.cid;
    try {
      const result = await cartsRepository.getCartById(cid);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //POST new product to cart
  static async addProductToCart(req, res) {
    const cid = req.user.cart;
    const pid = req.params.pid;
    const quantity = +req.query.quantity;
    const user = req.user;

    try {
      const result = await cartsRepository.addProductToCart(
        cid,
        pid,
        quantity,
        user
      );
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //PUT update only the quantity of a product
  static async updateCartProduct(req, res, next) {
    const cid = req.user.cart;
    const pid = req.params.pid;
    const quantity = +req.body.quantity;
    try {
      const result = await cartsRepository.updateCart(cid, pid, quantity);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //DELETE product from cart
  static async deleteProductFromCart(req, res, next) {
    const cid = req.user.cart;
    const pid = req.params.pid;
    try {
      const result = await cartsRepository.deleteProductFromCart(cid, pid);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //DELETE cart by id. Empty cart
  static async deleteCart(req, res, next) {
    const cid = req.params.cid;
    try {
      const result = await cartsRepository.deleteCart(cid);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //CREATE TICKET
  static async purchaseCart(req, res, next) {
    const cid = req.user.cart;
    const purchaser = req.user.email;

    try {
      const cartById = await cartsRepository.getCartById(cid);
      const payload = cartById.products;
      const result = await cartsRepository.purchaseCart(
        logger,
        cid,
        purchaser,
        payload
      );
      const response = apiSuccessResponse(result);
      logger.info("CheckOut Successful");
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      logger.error("CheckOut Unsuccessful");
      next(error);
    }
  }
}

module.exports = CartsController;
