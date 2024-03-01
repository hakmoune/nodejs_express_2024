require("dotenv").config(); // Allows to Load environment variables from .env file.
const express = require("express");
const app = express(); // Create the server, express app
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const credentials = require("./middleware/credentials");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3100;

// Connect To MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Handle options Credentials check - before Cross-Origin Resource Sharing (CORS)!
// to control whether the browser should include credentials. when making a cross-origin request.
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data // in other words, "form data": // 'content-type': application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Middleware extracts cookie data from HTTP requests
app.use(cookieParser());

// Built-in middleware for serving static files, img, css, txt // For each subdirectory(the default is slash /)
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//Handle Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use("/employees", require("./routes/api/employees"));
app.use("/subdir", require("./routes/subdir"));

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

// event listener in Mongoose, listens for the "open" event on the MongoDB connection
// L'événement "open" est émis une fois la connexion Mongoose au serveur MongoDB établie avec succès.
mongoose.connection.once("open", () => {
  // Callback function to be executed when the connection is open

  console.log("Connected to mongoDB");
  // Listening to the PORT
  app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
  });
});
