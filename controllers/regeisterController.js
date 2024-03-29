const User = require("../model/User");
const bcrypt = require("bcrypt");

// Register a New user
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  // check the credentials
  if (!user || !pwd)
    return res.status(400).json({
      message: "Username and password are required"
    });

  // check for dublicate usernames in the database
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // 409 Conflict

  try {
    // encrypt the pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create and Store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd
    });
    console.log(result);

    res.status(201).json({ success: `New User ${user} created !` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
