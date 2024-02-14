const express = require("express");
const router = express.Router();

const employeesController = require("../../controllers/employeesController");

// router.get("/", (req, res, next) => {
//   res.json(data.employees);
// });

// router.route is a method that allows you to create modular and chainable route handlers for a specific route.
// It returns a single route instance, and you can then chain HTTP method handlers (like .get(), .post(), etc.) on that route.
router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
