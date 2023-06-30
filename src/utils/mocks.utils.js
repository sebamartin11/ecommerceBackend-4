const { faker } = require("@faker-js/faker");
const { hashPassword } = require("./hash.utils");

faker.locale = "en";

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productName(),
    code: faker.random.alphaNumeric(8),
    price: faker.commerce.price(),
    thumbnails: faker.image.image(),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
  };
};

const ages = [];
for (let i = 0; i <= 60; i++) {
  ages.push(i + 14);
}

const hashMockPassword = hashPassword("1234");

const generateUser = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    age: faker.helpers.arrayElement(ages),
    password: hashMockPassword,
    role: faker.helpers.arrayElement(["user", "admin", "premium"]),
    cart: faker.database.mongodbObjectId(),
  };
};

module.exports = { generateProduct, generateUser };
