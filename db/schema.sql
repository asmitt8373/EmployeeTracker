DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT PRIMARY KEY,
  names VARCHAR(30)NULL 
);
CREATE TABLE roles (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);
CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30)NULL,
    last_name VARCHAR(30)NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);
