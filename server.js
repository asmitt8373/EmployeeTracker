const inquirer = require('inquirer');
// const fs = require('fs');
const mysql = require('mysql2');
// const cTable = require('console.table');
const express = require('express');

const port = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//MY SQL SERVER CONNECTION
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3001
    port: 3001,
    // Your username
    user: "root",
    // Your password
    password: "Skittles8373",
    database: "employee_db"
},
console.log(`Connected to the employee_db database.`)
);
var employee_tracker = function () {
inquirer.prompt([{
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles','Add Role','View All Departments','Add Department'],
    }]).then((answers) => {
    if (answers.prompt === 'View All Employees') {
        db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) throw err;
            console.log("Viewing All Employees: ");
            console.table(result);
            employee_tracker();
    });
} else if (answers.prompt === 'Add An Employee') {
        // Calling the database to acquire the roles and managers
        db.query(`SELECT * FROM employee, role`, (err, result) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    // Adding Employee First Name
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?',
                    validate: firstNameInput => {
                        if (firstNameInput) {
                            return true;
                        } else {
                            console.log('Please Add A First Name!');
                            return false;
                        }
                    }
                },
                {
                    // Adding Employee Last Name
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employees last name?',
                    validate: lastNameInput => {
                        if (lastNameInput) {
                            return true;
                        } else {
                            console.log('Please Add A Salary!');
                            return false;
                        }
                    }
                },
                {
                    // Adding Employee Role
                    type: 'list',
                    name: 'role',
                    message: 'What is the employees role?',
                    choices: () => {
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].title);
                        }
                        var newArray = [...new Set(array)];
                        return newArray;
                    }
                },
                {
                    // Adding Employee Manager
                    type: 'input',
                    name: 'manager',
                    message: 'Who is the employees manager?',
                    validate: managerInput => {
                        if (managerInput) {
                            return true;
                        } else {
                            console.log('Please Add A Manager!');
                            return false;
                        }
                    }
                }
            ]).then((answers) => {
                // Comparing the result and storing it into the variable
                for (var i = 0; i < result.length; i++) {
                    if (result[i].title === answers.role) {
                        var role = result[i];
                    }
                }

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                    employee_tracker();
                });
            })});
        } else if (answers.prompt === 'Update An Employee Role') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Choose an Employee to Update
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // Updating the New Role
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database.`)
                        employee_tracker();
                    });
                } else if (answers.prompt === 'View All Roles') {
                        db.query(`SELECT * FROM role`, (err, result) => {
                            if (err) throw err;
                            console.log("Viewing All Roles: ");
                            console.table(result);
                            employee_tracker();
                        });
                    } if (answers.prompt === 'Add A Role') {
                            // Beginning with the database so that we may acquire the departments for the choice
                            db.query(`SELECT * FROM department`, (err, result) => {
                                if (err) throw err;
                
                                inquirer.prompt([
                                    {
                                        // Adding A Role
                                        type: 'input',
                                        name: 'role',
                                        message: 'What is the name of the role?',
                                        validate: roleInput => {
                                            if (roleInput) {
                                                return true;
                                            } else {
                                                console.log('Please Add A Role!');
                                                return false;
                                            }
                                        }
                                    },
                                    {
                                        // Adding the Salary
                                        type: 'input',
                                        name: 'salary',
                                        message: 'What is the salary of the role?',
                                        validate: salaryInput => {
                                            if (salaryInput) {
                                                return true;
                                            } else {
                                                console.log('Please Add A Salary!');
                                                return false;
                                            }
                                        }
                                    },
                                    {
                                        // Department
                                        type: 'list',
                                        name: 'department',
                                        message: 'Which department does the role belong to?',
                                        choices: () => {
                                            var array = [];
                                            for (var i = 0; i < result.length; i++) {
                                                array.push(result[i].name);
                                            }
                                            return array;
                                        }
                                    }
                                ]).then((answers) => {
                                    // Comparing the result and storing it into the variable
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].name === answers.department) {
                                            var department = result[i];
                                        }
                                    }
                
                                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                                        if (err) throw err;
                                        console.log(`Added ${answers.role} to the database.`)
                                        employee_tracker();
                                    });
                                } else if   (answers.prompt === 'View All Department') {
                                        db.query(`SELECT * FROM department`, (err, result) => {
                                            if (err) throw err;
                                            console.log("Viewing All Departments: ");
                                            console.table(result);
                                            employee_tracker();
                                        });
                                    } else if (answers.prompt === 'Add A Department') {
                                        inquirer.prompt([{
                                            // Adding a Department
                                            type: 'input',
                                            name: 'department',
                                            message: 'What is the name of the dpeartment?',
                                            validate: departmentInput => {
                                                if (departmentInput) {
                                                    return true;
                                                } else {
                                                    console.log('Please Add A Department!');
                                                    return false;
                                                }
                                            }
                                        }]).then((answers) => {
                                            db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                                                if (err) throw err;
                                                console.log(`Added ${answers.department} to the database.`)
                                                employee_tracker();
                                            });
                                        });
                                };
                            } else if (answers.prompt === 'Log Out') {
                                db.end();
                                console.log("Good-Bye!");
    
                            };
                        }
                    };