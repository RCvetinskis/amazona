const bcrypt = require("bcrypt");
const data = {
  users: [
    {
      name: "Robertas",
      email: "robertas@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isAdmin: true,
    },
    {
      name: "Gabriele",
      email: "gabriele@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Nike Slim shirt",
      slug: "nike-slim-shirt",
      category: "Shirts",
      image:
        "https://static.massimodutti.net/3/photos/2021/I/0/1/p/5171/577/500/5171577500_1_1_3.jpg?t=1626776786478",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "high quality shirt",
    },
    {
      name: "Adidas Slim shirt",
      slug: "adidas-slim-shirt",
      category: "Shirts",
      image:
        "https://static.massimodutti.net/3/photos/2021/I/0/1/p/5107/535/420/5107535420_1_1_3.jpg?t=1629383415207",
      price: 140,
      countInStock: 0,
      brand: "Adidas",
      rating: 4.1,
      numReviews: 10,
      description: "high quality shirt",
    },
    {
      name: "Nike Slim pant",
      slug: "nike-slim-pant",
      category: "Pants",
      image:
        "https://themes.webberwebber.com/time/files/2014/01/231178-0092_2-364x485.jpeg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.9,
      numReviews: 54,
      description: "high quality product",
    },
    {
      name: "Nike Slim pant",
      slug: "nike-slim-pant",
      category: "Pants",
      image:
        "https://themes.webberwebber.com/time/files/2014/01/231178-0092_2-364x485.jpeg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.9,
      numReviews: 54,
      description: "high quality product",
    },
    {
      name: "Nike Slim pant",
      slug: "nike-slim-pant",
      category: "Pants",
      image:
        "https://themes.webberwebber.com/time/files/2014/01/231178-0092_2-364x485.jpeg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.9,
      numReviews: 54,
      description: "high quality product",
    },
    {
      name: "Adidas Slim pants",
      slug: "adidas-slim-pant",
      category: "Pants",
      image:
        "https://lores.pl/wp-content/uploads/2021/09/strutture1-364x485.jpg",
      price: 50,
      countInStock: 9,
      brand: "Nike",
      rating: 4,
      numReviews: 20,
      description: "high quality product",
    },
    {
      name: "Adidas Slim pants",
      slug: "adidas-slim-pant",
      category: "Pants",
      image:
        "https://lores.pl/wp-content/uploads/2021/09/strutture1-364x485.jpg",
      price: 50,
      countInStock: 9,
      brand: "Nike",
      rating: 4,
      numReviews: 20,
      description: "high quality product",
    },
    {
      name: "Adidas Slim pants",
      slug: "adidas-slim-pant",
      category: "Pants",
      image:
        "https://lores.pl/wp-content/uploads/2021/09/strutture1-364x485.jpg",
      price: 50,
      countInStock: 9,
      brand: "Nike",
      rating: 4,
      numReviews: 20,
      description: "high quality product",
    },
  ],
};

module.exports = data;
