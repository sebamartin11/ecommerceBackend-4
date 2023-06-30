const { Router } = require("express");
const {
  passportCustom,
} = require("../../middlewares/passportCustom.middleware");
const { authToken } = require("../../middlewares/authToken.middleware");

const router = Router();

const authMiddlewares = [passportCustom("jwt"), authToken];
const {
  viewsErrorMiddleware,
} = require("../../middlewares/viewsError.middleware");

const { getDAOS } = require("../../models/daos/daosFactory");

const { cartsDao, productsDao, ticketsDao } = getDAOS();

//LOGIN

router.get("/", (req, res, next) => {
  const data = {
    status: true,
    title: "Login",
    style: "index.css",
  };
  try {
    res.render("login", data);
  } catch (error) {
    next();
  }
});

//REGISTER

router.get("/register", (req, res, next) => {
  const data = {
    status: true,
    title: "Register",
    style: "index.css",
  };
  try {
    res.render("register", data);
  } catch (error) {
    next();
  }
});

//RECOVER

router.get("/recoverPassword", (req, res, next) => {
  const data = {
    title: "Password recover",
    style: "index.css",
  };
  try {
    res.render("recoverPassword", data);
  } catch (error) {
    next();
  }
});

//NEW PASSWORD

router.get("/newPassword", (req, res, next) => {
  const data = {
    title: "Create new password",
    style: "index.css",
  };
  try {
    res.render("newPassword", data);
  } catch (error) {
    next();
  }
});

//PRODUCTS

router.get("/products", authMiddlewares, async (req, res, next) => {
  try {
    const product = await productsDao.getProducts(req.query);
    const user = req.user;
    const isAdmin = req.user.role == "admin" || "premium";

    if (product.docs) {
      const data = {
        status: true,
        title: "Products",
        style: "index.css",
        list: product.docs,
        user,
        isAdmin,
      };

      res.render("realTimeProducts", data);
    } else {
      return res.status(404).render("realTimeProducts", {
        status: false,
        style: "index.css",
        data: "Empty list",
      });
    }
  } catch (error) {
    next();
  }
});

//CART

router.get("/cart", authMiddlewares, async (req, res, next) => {
  try {
    const cid = req.user.cart;
    const cartById = await cartsDao.getCartById(cid);

    if (!cartById || !cartById.products.length) {
      res.status(404).render("cart", {
        status: false,
        style: "index.css",
        data: "The cart is empty",
      });
    } else {
      const data = {
        status: true,
        title: "Cart",
        style: "index.css",
        list: cartById.products,
        cid,
      };

      res.render("cart", data);
    }
  } catch (error) {
    next();
  }
});

// TICKET
router.get("/ticket", authMiddlewares, async (req, res, next) => {
  const { tid } = req.params;
  try {
    const orderPurchased = await ticketsDao.getTicketById(tid);
    const data = {
      title: "Your Order",
      style: "index.css",
      orderPurchased,
    };

    res.render("ticket", data);
  } catch (error) {
    next();
  }
});

// CHAT
router.get("/chat", authMiddlewares, (req, res, next) => {
  try {
    const data = {
      title: "Chat",
      style: "index.css",
    };

    res.render("chat", data);
  } catch (error) {
    next();
  }
});

router.use(viewsErrorMiddleware);

module.exports = router;
