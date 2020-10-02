DROP DATABASE IF EXISTS company_roster_db;

CREATE DATABASE company_roster_db;

USE company_roster_db;

CREATE TABLE department
(
        id INT
        auto_increment NOT NULL,
name VARCHAR
        (30) NOT NULL,
primary key
        (id)
);

        CREATE TABLE role
        (
                id INT
                auto_increment NOT NULL,
title VARCHAR
                (30) NOT NULL,
salary DECIMAL
                (10,2) NULL,
department_id INT NOT NULL,
PRIMARY KEY
                (id),
FOREIGN KEY
                (department_id) REFERENCES department
                (id)
);

                CREATE TABLE employee
                (
                        id INT
                        auto_increment NOT NULL,
first_name VARCHAR
                        (30) NOT NULL,
last_name VARCHAR
                        (30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
primary key
                        (id),
foreign key
                        (role_id) REFERENCES role
                        (id),
foreign key
                        (manager_id) references employee
                        (id)
);