INSERT INTO department
    (name)
VALUES
    ("Sales"),
    ("Customer Service"),
    ("Human Resources"),
    ("Warehouse"),
    ("Accounting"),
    ("Administration"),
    ("Quality Assurance"),
    ("Management");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Manager", "75000.00", "8"),
    ("Salesman", "65000.00", "1"),
    ("Office Administrator", "40000.00", "6"),
    ("Accountant", "55000", "5");

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Scott", "1", NULL),
    ("Jim", "Halpert", "2", "1"),
    ("Pam", "Beasley", "3", "1"),
    ("Oscar", "Martinez", "4", "1");
    