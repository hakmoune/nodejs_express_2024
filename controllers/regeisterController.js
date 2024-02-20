const usersDB = {
  users: require("../model/users.json"),
  setUsers: function(data) {
    this.users = data;
  }
};

const fsPromises = require("fs").promises;
const path = require("path");
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
  const duplicate = usersDB.users.find(persone => persone.username === user);
  if (duplicate) return res.sendStatus(409); // 409 Conflict

  try {
    // encrypt the pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // store the new user
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);
    res.status(201).json({ success: `New User ${user} created !` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
