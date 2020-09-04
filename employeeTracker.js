const mysql = require("mysql");
const inquirer = require("inquirer");
const password = require("./password.js");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "LocalHost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: password,
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id" + connection.threadId + "\n");
    init();
})

function init() {
    inquirer
        .prompt([
            {
                type: "list",
                messsage: "What would you like to do?",
                choices: [
                    "View All Employees",
                    "View All Employees by Department",
                    "View All Employees by Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "EXIT"
                ],
                name: "action"
            }
        ]).then(({ action }) => {
            switch (action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Employees by Department":
                    viewDepartment();
                    break;
                case "View All Employees by Manager":
                    console.log(action + " Add this function")
                    break;
                case "Add Employee":
                    console.log(action + " Add this function")
                    break;
                case "Remove Employee":
                    console.log(action + " Add this function")
                    break;
                case "Update Employee Role":
                    console.log(action + " Add this function")
                    break;
                case "Update Employee Manager":
                    console.log(action + " Add this function")
                    break;
                default: connection.end();
            }
        })
};

function viewEmployees() {
    connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id, department.name
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON role.department_id = department.id`,
        (err, res) => {
            if (err) throw err;
            let table = [];
            for (let i in res) {
                table.push(
                    {
                        id: res[i].id,
                        first_name: res[i].first_name,
                        last_name: res[i].last_name,
                        title: res[i].title,
                        department: res[i].name,
                        salary: res[i].salary,
                        manager: res[i].manager_id
                    }
                )
            }
            console.log(cTable.getTable(table));
            init();
        });
}

function viewDepartment () {
    inquirer
        .prompt([
            {
                tpye: "list",
                message: "Select the department you would like to view",
                choices: ["Sales", "Finance", "Engineering", "Legal"] ,
                name: "department"
            }
        ]).then(({department})=>{
            connection.query()
        })
}