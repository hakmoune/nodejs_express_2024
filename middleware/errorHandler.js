const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  const message = `${req.method}\t${req.headers.origin}\t${req.url}\t${err.name}: ${err.message}`;
  logEvents(message, "errLog.txt");

  console.error(err.stack);

  res.status(500).send(err.message);
};

module.exports = errorHandler;
