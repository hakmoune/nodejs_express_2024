const moogoose = require("mongoose");

const connectDB = async () => {
  try {
    await moogoose.connect(process.env.DATABASE_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
