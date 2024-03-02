const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  if (!employees) {
    return res.status(204).json({ message: "No employees found." }); // No Content
  }

  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  // Chekc if firstname and lastname sent
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "Firts and Last Name are required." });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  // Check is the ID has been sent
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parametre is required." });
  }

  // Get the employee we wanna update
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  // if the employee hasn't found return Error
  if (!employee)
    return res
      .status(204) // No  Content
      .json({ message: `No employee matches ID ${req.body.id}.` });

  // If the employee exist, Update its first and last name
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  console.log("update", result);
  res.status(201).json(result);
};

const deleteEmployee = async (req, res) => {
  // Check id of employee to delete is sent
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID required" }); // 400: error bad request
  }

  // Check user exist
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID ${req.body.id}` });
  }

  // delelet employee
  const result = await employee.deleteOne(); // Employee.deleteOne({ _id: req.body.id })
  console.log("Delete", result);

  res.status(200).json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID required" });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    res.status(204).json({ message: `Employee ID ${req.params.id} not found` }); // No Content
  }

  res.status(200).json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
};
