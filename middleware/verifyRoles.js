const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401); // Unothorized
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);

    // Check if the user sent a true role
    const result = req.roles
      .map(role => rolesArray.includes(role)) // output [true, true, false].
      .find(val => val === true); // the find method is executed on the resulting array generated by map(). It searches for the first true value in the array.

    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
