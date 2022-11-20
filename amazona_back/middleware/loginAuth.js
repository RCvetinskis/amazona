const response = require("../modules/response");
const userDb = require("../schemas/userSchema");
module.exports = {
  validateRegistration: async (req, res, next) => {
    const { name, email } = req.body;
    // finds user to check if user name is taken
    const user = await userDb.findOne({ name });
    if (user) {
      if (user.name === name || user.email === email)
        return response(res, "user already exists", true);
    }
    next();
  },
};
