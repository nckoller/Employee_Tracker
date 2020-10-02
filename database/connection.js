const mysql = require("mysql");
const { user, password } = require("./config");
const connection = mysql.createConnection({
  host: "localhost",
  // Your port if not 3306
  port: 3306,
  // Your username
  user: user,
  // Your password
  password: password,
  database: "company_roster_db",
});
connection.connect(function (err) {
  if (err) throw err;
  //   console.log("connected as id " + connection.threadId + "\n");
});
// connection.connect();

// console.log(connection);

module.exports = connection;
