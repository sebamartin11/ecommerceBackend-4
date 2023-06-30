const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { CartsModel } = require("../../schemas/carts.schema");
const { ProductsModel } = require("../../schemas/products.schema");

class CartsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
  async getCarts() {
    const allCarts = await CartsModel.find();
    return allCarts;
  }

  async addCart() {
    const newCart = await CartsModel.create({ products: [] });
    return newCart;
  }

  async getCartById(cid) {
    const cartById = await CartsModel.findById(cid)
      .populate("products.product")
      .lean();
    return cartById;
  }

  async updateCartProduct(cid, pid, quantity) {
    const cartById = await this.getCartById(cid);
    const targetProduct = cartById.products.find((p) => p.product._id == pid);

    const productData = await ProductsModel.findById(pid);

    if (!targetProduct) {
      cartById.products.push({
        product: productData._id,
        amount: quantity,
      });
    } else {
      targetProduct.amount += quantity;
    }

    const result = await CartsModel.updateOne({ _id: cid }, cartById);
    return result;
  }

  async deleteProductFromCart(cid, pid) {
    const cartById = await this.getCartById(cid);

    const targetProduct = cartById.products.find(
      (product) => product.product._id.toString() == pid.toString()
    );

    if (!targetProduct) {
      throw new Error("Product not found");
    } else {
      cartById.products = cartById.products.filter(
        (p) => p.product._id.toString() !== pid.toString()
      );

      const result = await CartsModel.updateOne({ _id: cid }, cartById);
      return result;
    }
  }

  async deleteCart(cid) {
    const cartToClean = await this.getCartById(cid);
    cartToClean.products = [];
    const result = await CartsModel.updateOne({ _id: cid }, cartToClean);
    return result;
  }
}

module.exports = CartsMongoDao;
