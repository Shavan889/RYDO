const userModel = require("../models/user.models");

module.exports.createUser = async ({ fullname, email, password }) => {
  if (!fullname?.firstName || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = await userModel.create({
    fullname,   
    email,
    password,
  });

  return user;
};