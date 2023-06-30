const { PORT } = require("../../config/env.config");
const { HTTP_STATUS, HttpError } = require("../../utils/api.utils");

const { getDAOS } = require("../daos/daosFactory");

const { productsDao } = getDAOS();

class ProductsRepository {
  async addProduct(req) {
    const addNewProduct = req.body;
    const owner = req.user.role === "premium" ? req.user.email : "admin";
    const socket = req.app.get("socket");
    const filename = req.file.filename;

    const existingProduct = await productsDao.getProductByCode(
      addNewProduct.code
    );
    if (existingProduct) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Product already exist");
    }
    const newProduct = await productsDao.addProduct(
      addNewProduct.title,
      addNewProduct.description,
      addNewProduct.code,
      +addNewProduct.price,
      (addNewProduct.thumbnail = filename),
      +addNewProduct.stock,
      addNewProduct.category,
      owner
    );
    socket.emit("newProduct", newProduct);
    return newProduct;
  }

  async getAllProduct(req) {
    const limit = req.query.limit || 10;
    const products = await productsDao.getProducts(req.query);
    const data = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      nextLink: products.hasNextPage
        ? `http://localhost:${PORT}${req.baseUrl}/?limit=${limit}&page=${products.nextPage}`
        : null,
      prevLink: products.hasPrevPage
        ? `http://localhost:${PORT}${req.baseUrl}/?page=/${products.prevPage}`
        : null,
    };
    return data;
  }

  async getProductById(pid) {
    if (!pid) {
      throw HttpError("Please specify a product ID", HTTP_STATUS.BAD_REQUEST);
    }

    const productById = await productsDao.getProductById(pid);

    if (!productById) {
      throw new HttpError("Product not found", HTTP_STATUS.NOT_FOUND);
    }
    return productById;
  }

  async updateProductById(pid, product) {
    if (!pid || !product) {
      throw HttpError(
        "Please provide an id and a payload for the product",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const productById = await productsDao.getProductById(pid);

    if (!productById) {
      throw new HttpError("Product not found", HTTP_STATUS.NOT_FOUND);
    }
    const price = product.price ? Number(product.price) : productById.price;
    const stock = product.stock ? Number(product.stock) : productById.stock;
    const thumbnail = product.thumbnail
      ? +product.thumbnail
      : productById.thumbnail;
    const status = product.status ? +product.status : productById.status;
    const newProductProperties = {
      ...product,
      thumbnail,
      price,
      stock,
      status,
    };
    const productUpdated = await productsDao.updateProduct(
      pid,
      newProductProperties
    );
    return productUpdated;
  }

  async deleteProductById(pid, user) {
    if (!pid) {
      throw HttpError("Please specify a product ID", HTTP_STATUS.BAD_REQUEST);
    }

    const productById = await productsDao.getProductById(pid);
    if (!productById) {
      throw new HttpError("Product not found", HTTP_STATUS.NOT_FOUND);
    }

    if (user.role === "premium" && user.email !== product.owner) {
      throw new HttpError(
        "Only product's owner can delete this resource",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const deleteProduct = await productsDao.deleteProduct(pid);
    return deleteProduct;
  }
}

module.exports = new ProductsRepository();
