const express = require("express");
const router = express.Router();

const data = {};
data.employees = require("../../data/employees.json");

// router.get("/", (req, res, next) => {
//   res.json(data.employees);
// });

router
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    res.status(200).json({
      firstname: req.body.firstname,
      firstname: req.body.lastname
    });
  })
  .put((req, res) => {
    res.status(200).json({
      firstname: req.body.firstname,
      firstname: req.body.lastname
    });
  })
  .delete((req, res) => {
    res.status(200).json({
      id: req.body.id
    });
  });

router.route("/:id").get((req, res) => {
  res.status(200).json({
    id: req.params.id
  });
});

module.exports = router;
