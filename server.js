const express = require("express");
const app = express(); // Create the server, express app

const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const PORT = process.env.PORT || 3100;

const errorHandler = require("./middleware/errorHandler");

// Custom middleware logger
// req.headers.origin = website sending from
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = ["https://www.yoursite.com", "http://localhost:3100"];
const corsOptions = {
  origin: (origin, callback) => {
    // !origin === the same site, undefined cross site
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // The first argument (null) indicates that there is no error.
      // The second argument (true) indicates that the request is allowed.
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});*/

// built-in middleware to handle urlencoded data
// in other words, "form data":
// 'content-type': application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Built-in middleware for serving static files, img, css, txt
app.use(express.static(path.join(__dirname, "/public")));

// ^ = begin, $ = end, (.html)? = made it optional
app.get("^/$|index(.html)?", (req, res) => {
  // res.send("Hello World !"); // Send Text
  // res.sendFile("./views/index.html", { root: __dirname }); // send File, in this case the HTML
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

////////////
app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

////////////
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

///////////////
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load...");
    next();
  },
  (req, res) => {
    res.send("Hello Everyone !");
  }
);

////////////////
const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);
//////////////////////

// app.all:  Apply for all http methods
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    // is used to set the Content-Type HTTP
    // to test it use Postman
    res.type("txt").send("404 not found");
  }
});
//////////////////////

app.use(errorHandler);

/////////////
app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
