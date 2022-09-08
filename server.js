const inquirer = require("inquirer");
const fs = require("fs");
const db = require("./db/connection");
var start = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Employees",
            value: "View_employees",
          },
          {
            name: "Add Employee",
            value: "add_employee",
          },
          {
            name: "Update Employee Role",
            value: "update",
          },
          {
            name: "View All Roles",
            value: "view_all_roles",
          },
          {
            name: "Add Role",
            value: "add_role",
          },
          {
            name: "View All Departments",
            value: "all_departments",
          },
          {
            name: "Add Department",
            value: "add_department",
          },
          { name: "Remove Department", value: "remove_department" },
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.choices) {
        case "View_employees":
          viewEmployees();
          break;
        case "add_employee":
          addEmployee();
          break;
        case "update":
          updateEmpRole();
          break;
        case "view_all_roles":
          viewRoles();
          break;
        case "add_role":
          addRole();
          break;
        case "all_departments":
          viewDepartments();
          break;
        case "add_department":
          addDepartment();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
};
function viewEmployees() {
  db.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
const addEmployee = () => {
  db.query("SELECT * FROM roles", (err, roles) => {
    if (err) {
      console.log(err);
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "First Name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Last Name:",
        },
        {
          type: "list",
          name: "role_id",
          message: "Role ID:",
          choices: roles.map((role) => ({
            name: `${role.title}`,
            value: role.id,
          })),
        },
      ])
      .then(function (answers) {
        db.query("INSERT INTO employees SET ?", answers, function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        });
      });
  });
};
function updateEmpRole() {
  db.query("SELECT * FROM employees", (err, employees) => {
    if (err) {
      console.log(err);
    }
    db.query(`SELECT * FROM roles`, (err, roles) => {
      if (err) {
        console.log(err);
      }
      inquirer
        .prompt([
          {
            type: "list",
            name: "selectEmp",
            message: "Select the employee who's role will be updated",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name} - Role ID:${employee.role_id}`,
              value: employee.id,
            })),
          },
          {
            type: "list",
            name: "updatedRole",
            message: "New Role ID:",
            choices: roles.map((role) => ({
              name: `${role.title}`,
              value: role.id,
            })),
          },
        ])
        .then(function (answers) {
          db.query(
            "UPDATE employees SET ? WHERE ?",
            [{ role_id: answers.updatedRole }, { id: answers.selectEmp }],
            function (err, res) {
              if (err) throw err;
              console.log("Employee role updated!");
              start();
            }
          );
        });
    });
  });
}
function viewRoles() {
  db.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
const addRole = () => {
  db.query("SELECT * FROM departments", (err, departments) => {
    if (err) {
      console.log(err);
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Name of role you wish to add:",
        },
        {
          type: "number",
          name: "salary",
          message: "Salary for role:",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Department ID:",
          choices: departments.map((department) => ({
            name: department.names,
            value: department.id,
          })),
        },
      ])
      .then(function (answers) {
        db.query(
          "INSERT INTO roles SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentId,
          },
          function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
          }
        );
      });
  });
};
function viewDepartments() {
  db.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "addDepartment",
        message: "Name of Department you wish to add:",
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INTO departments SET ?",
        {
          names: answer.addDepartment,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        }
      );
    });
}
start();
