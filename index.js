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

// Add new role
function createNewRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
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
            for (var i = 0; i < results.length; i++) {
              departmentArr.push(results[i].name);
            }
            return departmentArr;
          },
          message: "Which department will this role belong to?",
        },
      ])
      .then(function (answer) {
        // Add the department ID to the role
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

    //
    //     {
    //         name: "salary",
    //         type: "number",
    //         message: "What is the salary?"
    //     },

    // ])
    // .then(function (answer) {
    //     connection.query(
    //         "INSERT INTO role SET ?",
    //         {
    //             name:
    //         }
    //     )
    // })
  });
}

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
createNewRole();
// Add new employee

// View all departments
function viewDepartments() {
  connection.query;
}
// View all roles

// View all employees

// Update employee roles
