const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { ProductsModel } = require("../../schemas/products.schema");

class ProductsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }

  async getProducts({ limit, page, query, sort }) {
    const filter = query ? { category: query } : {};

    const options = {
      sort: sort ? { price: sort } : {},
      limit: limit || 10,
      page: page || 1,
      lean: true,
    };

    const allProducts = await ProductsModel.paginate(filter, options);
    return allProducts;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    thumbnail,
    stock,
    category,
    owner
  ) {
    const obj = {
      title,
      description,
      code,
      price,
      thumbnail,
      stock,
      category,
      owner,
    };
    const newProduct = await ProductsModel.create(obj);
    return newProduct;
  }

  async getProductById(pid) {
    const productById = await ProductsModel.findById(pid);
    return productById;
  }

  async getProductByCode(code) {
    const productByCode = await ProductsModel.findOne({ code: code });
    return productByCode;
  }

  async updateProduct(pid, newProductProperties) {
    const productUpdated = await ProductsModel.findByIdAndUpdate(
      pid,
      newProductProperties
    );
    return productUpdated;
  }

  async deleteProduct(pid) {
    const result = await ProductsModel.findByIdAndDelete(pid);
    return result;
  }
}
module.exports = ProductsMongoDao;
