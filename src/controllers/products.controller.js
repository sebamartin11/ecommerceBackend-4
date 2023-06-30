const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");

const productsRepository = require("../models/repositories/products.repository");

class ProductsController {
  //CREATE new product
  static async addProduct(req, res, next) {
    try {
      const result = await productsRepository.addProduct(req);
      const response = apiSuccessResponse(result);
      return res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET all products + query param + paginate

  static async getProducts(req, res, next) {
    try {
      const result = await productsRepository.getAllProduct(req);
      const response = apiSuccessResponse(result);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET product by id
  static async getProductById(req, res, next) {
    const pid = req.params.pid;
    try {
      const result = await productsRepository.getProductById(pid);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //UPDATE product by id

  static async updateProduct(req, res, next) {
    const pid = req.params.pid;
    const product = req.body;
    try {
      const result = await productsRepository.updateProductById(pid, product);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //DELETE product by id

  static async deleteProduct(req, res, next) {
    const pid = req.params.pid;
    const user = req.user;
    try {
      const result = await productsRepository.deleteProductById(pid, user);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
