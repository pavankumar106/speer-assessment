const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("db connected "))
    .catch((error) => {
      console.log(error);
      console.log(error.message);
      console.log("error in connecting db");
      process.exit(1);
    });
};
module.exports = database;
