const fs = require("fs/promises");
const { CartsModel } = require("../../schemas/carts.schema");

class CartsFileSystemDao {
  constructor(path, productsDao) {
    this.path = path;
    this.productsDao = productsDao;
  }

  async getCarts() {
    const dataCarts = await fs.readFile(this.path, "utf-8");
    const allCarts = JSON.parse(dataCarts);
    return allCarts;
  }

  async saveCarts(allCarts) {
    await fs.writeFile(this.path, JSON.stringify(allCarts, null, "\t"));
  }

  async addCart() {
    const data = await this.getCarts();
    const newCart = new CartsModel();
    data.push(newCart);
    await this.saveCarts(data);
    return newCart;
  }

  async getCartById(cid) {
    const allCarts = await this.getCarts();
    const cartById = allCarts.find((cart) => cart._id === cid);
    const allProducts = await this.productsDao.getProducts();

    cartById.products = cartById.products.map((p) => {
      const filteredProduct = allProducts.find(
        (product) => product._id === p.product
      );
      return {
        product: {
          ...filteredProduct,
        },
        amount: p.amount,
      };
    });

    return cartById;
  }

  async updateCartProduct(cid, pid, quantity) {
    const allCarts = await this.getCarts();

    const cartIndex = allCarts.findIndex((c) => c._id === cid);

    const cartById = allCarts[cartIndex];
    const productIndex = cartById.products.findIndex(
      (product) => product.product === pid
    );

    if (productIndex >= 0) {
      cartById.products[productIndex] = {
        product: targetProduct.product,
        amount: targetProduct.amount + +quantity,
      };
    } else {
      cartById.products.push({ product: pid, amount: +quantity });
    }

    allCarts[cartIndex] = cartById;

    await this.saveCarts(allCarts);
    return cartById;
  }

  async deleteProductFromCart(cid, pid) {
    const allCarts = await this.getCarts();

    const cartIndex = allCarts.findIndex(
      (c) => c._id.toString() === cid.toString()
    );

    const cartById = allCarts[cartIndex];

    const targetProduct = await cartById.products.find(
      (product) => product.product.toString() === pid.toString()
    );

    if (!targetProduct) {
      throw new Error("Product not found");
    } else {
      const filteredCart = await cartById.products.filter(
        (id) => id.product.toString() !== pid.toString()
      );
      const updatedCart = { ...cartById, products: [...filteredCart] };

      allCarts[cartIndex] = updatedCart;

      await this.saveCarts(allCarts);
      return updatedCart;
    }
  }

  async deleteCart(cid) {
    const AllCarts = await this.getCarts();
    const filteredById = AllCarts.filter((cart) => cart._id !== cid);
    await this.saveCarts(filteredById);
    return filteredById;
  }
}

module.exports = CartsFileSystemDao;
