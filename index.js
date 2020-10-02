const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require("./database/connection");

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

insertNewDept();
