const express = require("express");
const app = express(); // Create the server, express app
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const PORT = process.env.PORT || 3100;
const errorHandler = require("./middleware/errorHandler");

// Custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data // in other words, "form data": // 'content-type': application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Built-in middleware for serving static files, img, css, txt // For each subdirectory(the default is slash /)
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//Handle Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// Handle not found pages 404 // app.all:  Apply for all http methods
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

// Custom middleware to Handle Errors
app.use(errorHandler);

// Listening to the PORT
app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
