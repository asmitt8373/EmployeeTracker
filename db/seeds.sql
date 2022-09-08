use employee_db;

insert into departments(names)
values
('HR'),
('Technology');


insert into roles(title, salary, department_id)
values
('Director', 100000, 1),
('Coder', 120000, 2);

insert into employees(first_name, last_name, role_id, manager_id)
values
('jake', 'smith',1,NULL),
('blake', 'jones',2,1);

