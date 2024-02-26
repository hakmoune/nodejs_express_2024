const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    // !origin === the same site, "undefined" cross site {req.headers.origin}
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // The first argument (null) indicates that there is no error.
      // The second argument (true) indicates that the request is allowed.
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
