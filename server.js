const express = require("express");
const app = express(); // Create the server, express app

const path = require("path");

const PORT = process.env.PORT || 3100;

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

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

/////////////
app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
