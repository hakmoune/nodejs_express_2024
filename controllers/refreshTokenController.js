const usersDB = {
  users: require("../model/users.json"),
  setUsers: function(data) {
    this.users = data;
  }
};

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Allows to Load environment variables from .env file.

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(401); // Unauthorized
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    person => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); // Forbidden, invalid RefreshToken

  // Evaluate JWT Refresh Token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403); // Forbidden, Invalid or Expired RefreshToken

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // 5-10min
    );

    res.send({ accessToken });
  });
};

module.exports = { handleRefreshToken }; // 4.50min
