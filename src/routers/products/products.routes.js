const { BaseRouter } = require("../base.router");
const uploader = require("../../utils/multer.utils");
const ProductsController = require("../../controllers/products.controller");

class ProductsRoutes extends BaseRouter {
  init() {
    this.get("/", ["user", "admin", "premium"], ProductsController.getProducts);
    this.get(
      "/:pid",
      ["user", "admin", "premium"],
      ProductsController.getProductById
    );
    this.post(
      "/",
      ["admin", "premium"],
      uploader.single("thumbnail"),
      ProductsController.addProduct
    );
    this.put("/:pid", ["admin", "premium"], ProductsController.updateProduct);
    this.delete(
      "/:pid",
      ["admin", "premium"],
      ProductsController.deleteProduct
    );
  }
}

module.exports = new ProductsRoutes();
