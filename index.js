const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require("./database/connection");
const cTable = require("console.table");

function runUserMenu() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add New Department",
        "Add New Role",
        "Add New Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add New Department":
          insertNewDept();
          break;

        case "Add New Role":
          createNewRole();
          break;

        case "Add New Employee":
          createNewEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

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
      department_id: answer.departmentId,
    },
    function (err) {
      if (err) throw err;
      console.log("The new role was created successfully.");
      runUserMenu();
    }
  );
}

// Builds arrays for Roles and Employee names/IDs
function createNewEmployee() {
  let roleArr = [];
  let employeeArr = ["N/A"];

  // Selects all role options from the database and puts them in an array
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
        type: "list",
        choices: roleArr,
        message: "What is this employee's role?",
      },
      {
        name: "managerID",
        type: "list",
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
      newEmployee.first_name = answer.firstName;
      newEmployee.last_name = answer.lastName;
      insertNewEmployee(newEmployee);
    });
}

// Inserts new employee into the database table
function insertNewEmployee(newEmployee) {
  connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: newEmployee.first_name,
      last_name: newEmployee.last_name,
      role_id: newEmployee.roleID,
      manager_id: newEmployee.managerID,
    },
    function (err) {
      if (err) throw err;
      console.log("The new employee was added successfully.");
      runUserMenu();
    }
  );
}

// View all departments in the CLI
function viewDepartments() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.table(results);
    runUserMenu();
  });
}

// View all roles in the CLI
function viewAllRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.table(results);
    runUserMenu();
  });
}

// View all employees in the CLI
function viewAllEmployees() {
  let query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee, role WHERE role.id = employee.role_id";
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.table(results);
    runUserMenu();
  });
}

// Update the role of an exisiting employee
function updateEmployeeRole() {
  let employeeArr = [];
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
    let roleArr = [];
    // Selects all role options from the database and puts them in an array
    connection.query("SELECT * FROM role", function (err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
        let roleChoices = results[i].id + " " + results[i].title;
        roleArr.push(roleChoices);
      }
    });

    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",
          choices: employeeArr,
          message: "Which employee would you like to update?",
        },
        {
          name: "newRole",
          type: "list",
          choices: roleArr,
          message: "Select the new role",
        },
      ])
      .then((answer) => {
        const updateRole = {};
        updateRole.employeeID = parseInt(answer.employeeName);
        updateRole.roleID = parseInt(answer.newRole);

        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [
          updateRole.roleID,
          updateRole.employeeID,
        ]);
        console.log("The employee's role was successfully updated.");
        runUserMenu();
      });
  });
}

setTimeout(function () {
  runUserMenu();
}, 3000);
