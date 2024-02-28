const express = require("express");
const router = express.Router();

const employeesController = require("../../controllers/employeesController");
const verifyJWT = require("../../middleware/verifyJWT");

const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// router.get("/", (req, res, next) => {
//   res.json(data.employees);
// });

// router.route is a method that allows you to create modular and chainable route handlers for a specific route.
// It returns a single route instance, and you can then chain HTTP method handlers (like .get(), .post(), etc.) on that route.
router
  .route("/")
  .get(verifyJWT, employeesController.getAllEmployees)
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    employeesController.deleteEmployee
  );

router.route("/:id").get(verifyJWT, employeesController.getEmployee);

module.exports = router;
