const { BaseRouter } = require("../base.router");
const MocksController = require("../../controllers/mocks.controller");

class MocksRoutes extends BaseRouter {
  init() {
    this.get("/products", ["admin"], MocksController.generateMockProducts);
    this.get("/users", ["admin"], MocksController.generateMockUsers);
  }
}

module.exports = new MocksRoutes();
