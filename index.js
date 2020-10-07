const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require("./database/connection");

// Adds a new department to the database
function insertNewDept() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function (err) {
          if (err) throw err;
          console.log("Your department was created successfully!");
        }
      );
    });
}

// insertNewDept();

// Creates new Role to add to database
function createNewRole() {
  // pulls department info from the database so department_id can be acquired
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    // prompts user for information about the role
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What role would you like to add?",
        },
        {
          name: "salary",
          type: "number",
          message: "what is the salary?",
        },
        {
          name: "department",
          type: "rawlist",
          choices: function () {
            let departmentArr = [];
            for (let i = 0; i < results.length; i++) {
              departmentArr.push(results[i].name);
            }
            return departmentArr;
          },
          message: "Which department will this role belong to?",
        },
      ])
      .then(function (answer) {
        // determines the department_id based on department name
        let idFound = false;
        let i = 0;
        while (idFound === false) {
          if (results[i].name === answer.department) {
            answer.departmentId = results[i].id;
            idFound = true;
            insertNewRole(answer);
          }
          i++;
        }
      });
  });
}

// Inserts new role into the role table in the database
function insertNewRole(answer) {
  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary: answer.salary,
      departmentId: answer.departmentId,
    },
    function (err) {
      if (err) throw err;
      console.log("The new role was created successfully.");
    }
  );
}

// createNewRole();

// Add new employee
function createNewEmployee() {
  let roleArr = [];
  let employeeArr = ["N/A"];
  //Selects all role options from the database and puts them in an array
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      let roleChoices = results[i].id + " " + results[i].title;
      roleArr.push(roleChoices);
    }
  });
  // Selects all the current employees in the database and puts them in an array
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      let employeeRoster =
        results[i].id +
        " " +
        results[i].first_name +
        " " +
        results[i].last_name;
      employeeArr.push(employeeRoster);
    }
    // console.log(employeeArr);
  });

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the new employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the new empoyee's last name?",
      },
      {
        name: "roleID",
        type: "rawlist",
        choices: roleArr,
        message: "What is this employee's role?",
      },
      {
        name: "managerID",
        type: "rawlist",
        choices: employeeArr,
        message: "Who is the employee's manager? Select 'N/A' if none",
      },
    ])
    .then(function (answer) {
      const newEmployee = {};
      // Selects just the integer for roleID
      newEmployee.roleID = parseInt(answer.roleID);
      // If they answer N/A for manager, let managerID be NULL, otherwise selected integer of managerID
      newEmployee.managerID =
        answer.managerID === "N/A" ? null : parseInt(answer.managerID);
      newEmployee.first_name = newEmployee.firstName;
      newEmployee.last_name = newEmployee.lastName;
      insertNewEmployee(newEmployee);
    });
}

// function insertNewEmployee(newEmployee) {
//   connection.query(
//     "INSERT INTO employee SET ?",
//     {
//       first_name: newEmployee.firstName,
//       last_name: newEmployee.lastName,
//       role_id: newEmployee.roleID,
//       manager_id: newEmployee.managerID,
//     },
//     function (err) {
//       if (err) throw err;
//       console.log("The new employee was added successfully.");
//     }
//   );
// }
// createNewEmployee();

// View all departments
function viewDepartments() {
  connection.query;
}
// View all roles

// View all employees

// Update employee roles
