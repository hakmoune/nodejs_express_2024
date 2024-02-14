const data = {
  employees: require("../model/employees.json"),
  setEmployees: data => {
    this.employees = data;
  }
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "Firts and Last Name are required." });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  // Get the employee we wanna update
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

  // if the employee hasn't found return Error
  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }

  // If the employee exist, Update its  first and last name
  if (req.body.firstname) employee.firstname === req.body.firstname;
  if (req.body.lastname) employee.lastname === req.body.lastname;

  // Delete the employee's old information from the Data object
  const filtredArray = data.employees.filter(
    emp => emp.id !== parseInt(req.body.id)
  );

  // Add the employee's new information to the Data object, but it's not on the right order
  const unsortedArray = [...filtredArray, employee];

  // a.id > b.id ? 1   ===   a should come "after" b
  // a.id < b.id ? -1  ===   a should come "before" b
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  res.status(201).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  }

  const filtredArray = data.employees.filter(
    emp => emp.id !== parseInt(req.body.id)
  );

  data.setEmployees([...filtredArray]);
  res.status(200).json({ id: req.body.id });
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

  if (!employee) {
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
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
