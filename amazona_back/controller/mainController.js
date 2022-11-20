const { products, users } = require("../modules/data");
const User_db = require("../schemas/userSchema");
const response = require("../modules/response");
const Order_Db = require("../schemas/orderSchema");
const Product_db = require("../schemas/productSchema");
const { generateToken } = require("../utils");
const bcrypt = require("bcrypt");

const PAGE_SIZE = 3;

module.exports = {
  productsUsersFromData: async (req, res) => {
    await Product_db.deleteMany({});
    const createdProducts = await Product_db.insertMany(products);
    await User_db.deleteMany({});
    const createdUsers = await User_db.insertMany(users);

    res.send({ createdProducts, createdUsers });
  },
  apiProducts: async (req, res) => {
    const products = await Product_db.find();

    res.send(products);
  },
  singleProduct: async (req, res) => {
    const product = await Product_db.findOne({ slug: req.params.slug });
    if (product) {
      response(res, "product was sent", false, product);
    } else {
      response(res.status(404), "product not found", true);
    }
  },
  productId: async (req, res) => {
    const product = await Product_db.findById(req.params.id);
    if (product) {
      response(res, "product was sent", false, product);
    } else {
      response(res.status(404), "product not found", true);
    }
  },
  usersSignIn: async (req, res) => {
    const { email, password } = req.body;
    const user = await User_db.findOne({ email });
    if (user) {
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        const thisUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        };
        return response(res, "succsefully loged in", false, thisUser);
      }
    }
    return response(res.status(401), "Invalid email or password", true);
  },
  userSignUp: async (req, res) => {
    const { name, password, email } = req.body;
    const newUser = new User_db({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const user = await newUser.save();
    const thisUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    };
    return response(res, "succsefully signed up", false, thisUser);
  },
  orders: async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;
    const newOrder = new Order_Db({
      orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  },

  showOrderStatus: async (req, res) => {
    const order = await Order_Db.findById(req.params.id);

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  },
  paypalApi: async (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || "sb");
  },
  payPalOrder: async (req, res) => {
    const order = await Order_Db.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404), send({ message: "Order Not Found" });
    }
  },
  mineOrder: async (req, res) => {
    // returns orders of current user
    const orders = await Order_Db.find({ user: req.user._id });

    res.send(orders);
  },
  changeAccDetails: async (req, res) => {
    const user = await User_db.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 10);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  },
  sendCategories: async (req, res) => {
    // distinct method gets only category products from db
    const categories = await Product_db.find().distinct("category");
    res.send(categories);
  },

  searchProducts: async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product_db.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product_db.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  },
};
