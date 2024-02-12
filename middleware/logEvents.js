const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// Logger Custom Middleware
const logger = (req, res, next) => {
  const message = `${req.method}\t${req.headers.origin}\t${req.url}`;
  logEvents(message, "reqLog.txt");
  next();
};

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "dd/MM/yyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs")))
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  logger,
  logEvents
};
