const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res.status(400).json({
      message: "Username and password are required"
    });

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles); // return array of the value of roles // Ex Output: [2001, 1984]
    // Create JWT access & refresh TOKENS
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // 5-10min
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //Saving refreshToken with Current User
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // Cookie is sent by the FRONT every time we make a request to the domaine that it's associated with
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
