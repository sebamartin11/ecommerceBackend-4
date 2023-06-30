const fs = require("fs/promises");
const { ProductsModel } = require("../../schemas/products.schema");

class ProductsFileSystemDao {
  constructor(path) {
    this.path = path;
  }

  async getProducts({ limit, page, query, sort }) {
    const dataProducts = await fs.readFile(this.path, "utf-8");
    const allProducts = JSON.parse(dataProducts);
    const filteredProducts = query
      ? allProducts.filter((product) => product.category === query)
      : allProducts;

    const sortedProducts = sort
      ? filteredProducts.sort((a, b) => {
          return sort === "asc" ? a.price - b.price : b.price - a.price;
        })
      : filteredProducts;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    return {
      docs: paginatedProducts,
      totalDocs: allProducts.length,
      limit: limit,
      totalPages: Math.ceil(allProducts.length / limit),
      page: page,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < Math.ceil(allProducts.length / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(allProducts.length / limit) ? page + 1 : null,
    };
  }

  async saveProducts(allProducts) {
    await fs.writeFile(this.path, JSON.stringify(allProducts, null, "\t"));
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
    const allProducts = await this.getProducts();
    if (
      !allProducts.find((product) => product.code === code) &&
      title &&
      description &&
      code &&
      price &&
      thumbnail &&
      stock &&
      category &&
      owner
    ) {
      const newProduct = new ProductsModel({
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        category,
        owner,
      });

      allProducts.push(newProduct);

      await this.saveProducts(allProducts);

      return newProduct;
    }
  }

  async getProductById(pid) {
    const allProducts = await this.getProducts();
    const productById = allProducts.find((product) => product._id === pid);
    return productById;
  }

  async getProductByCode(code) {
    const allProducts = await this.getProducts();
    const productByCode = allProducts.find((product) => product.code === code);
    return productByCode;
  }

  async updateProduct(id, newProductProperties) {
    const allProducts = await this.getProducts();
    const productById = await this.getProductById(id);

    const productUpdates = { ...productById, ...newProductProperties };

    const updatedProduct = allProducts.map((product) => {
      if (product._id === productUpdates._id) {
        return productUpdates;
      } else {
        return product;
      }
    });

    await this.saveProducts(updatedProduct);

    return updatedProduct;
  }

  async deleteProduct(pid) {
    const allProducts = await this.getProducts();
    const filteredById = allProducts.filter((product) => product._id !== pid);
    await this.saveProducts(filteredById);
    return filteredById;
  }
}

module.exports = ProductsFileSystemDao;
