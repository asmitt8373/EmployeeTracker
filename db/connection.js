
const mysql = require('mysql2');
// const cTable = require('console.table');

//MY SQL SERVER CONNECTION
const connection = mysql.createConnection({
    host: "127.0.0.1",
    
    // Your username
    user: "root",
    // Your password
    password: "Skittles8373",
    database: "employee_db"
},
console.log(`Connected to the employee_db database.`)
);
connection.connect(err =>{
    if(err)throw err 
})
module.exports = connection