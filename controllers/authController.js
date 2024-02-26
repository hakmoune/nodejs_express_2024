const usersDB = {
  users: require("../model/users.json"),
  setUsers: function(data) {
    this.users = data;
  }
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Allows to Load environment variables from .env file.
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res.status(400).json({
      message: "Username and password are required"
    });

  const foundUser = usersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // Create JWT access and refresh TOKENS
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // 5-10min
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //Saving refreshToken with Current User
    const otherUsers = usersDB.users.filter(
      person => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    // Cookie is sent by the FRONT every time we make a request to the domaine that it's assiated with
    // On the front you should use credentials: true, Otherwise you get a CROSS Error
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 // = Equals 1 day,  the cookie will expire
    });
    res.json({
      accessToken
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}; //5

module.exports = { handleLogin };
