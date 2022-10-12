const express = require("express");
const router = express.Router();
const {
  productsUsersFromData,
  apiProducts,
  singleProduct,
  productId,
  usersSignIn,
  userSignUp,
  orders,
  showOrderStatus,
  paypalApi,
  payPalOrder,
  mineOrder,
  changeAccDetails,
  sendCategories,
  searchProducts,
} = require("../controller/mainController");
const { isAuth } = require("../middleware/isAuth");

router.get("/api/seed", productsUsersFromData);
router.get("/api/products", apiProducts);
router.get("/api/products/slug/:slug", singleProduct);
router.get("/api/products/:id", productId);
router.post("/api/signin", usersSignIn);
router.post("/api/signup", userSignUp);
router.post("/api/orders", isAuth, orders);
router.get("/api/orders/mine", isAuth, mineOrder);
router.get("/api/orders/:id", isAuth, showOrderStatus);
router.get("/api/keys/paypal", paypalApi);
router.put("/api/orders/:id/pay", isAuth, payPalOrder);
router.put("/api/users/profile", isAuth, changeAccDetails);
router.get("/api/categories", sendCategories);
router.get("/api/searchproducts", searchProducts);

module.exports = router;
