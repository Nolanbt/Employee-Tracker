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
                    "View All Employees by Role",
                    "Add Employee",
                    "Add Role",
                    "Add Department",
                    "Update Employee Role",
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
                case "View All Employees by Role":
                    viewByRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Update Employee Role":
                    updateRole();
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
                if (res[i].manager_id === null) {
                    table.push(
                        {
                            id: res[i].id,
                            first_name: res[i].first_name,
                            last_name: res[i].last_name,
                            title: res[i].title,
                            department: res[i].name,
                            salary: res[i].salary,
                            manager: "null"
                        }
                    )
                }
                else {
                    table.push(
                        {
                            id: res[i].id,
                            first_name: res[i].first_name,
                            last_name: res[i].last_name,
                            title: res[i].title,
                            department: res[i].name,
                            salary: res[i].salary,
                            manager: `${res[res[i].manager_id].first_name} ${res[res[i].manager_id].last_name}`
                        }
                    )
                }
            }
            console.log(cTable.getTable(table));
            init();
        });
}


function viewDepartment() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select the department you would like to view",
                choices: ["Sales", "Finance", "Engineering", "Legal"],
                name: "task"
            }
        ]).then(({ task }) => {
            connection.query(`
            SELECT employee.first_name, employee.last_name, role.title, department.name
            FROM employee
            INNER JOIN role ON role.id = employee.role_id
            INNER JOIN department ON role.department_id = department.id
            WHERE department.name = ?;`, 
            [task],
            (err,res)=>{
                if (err) throw err;
                console.log(res);
                let table = [];
                for (let i in res){
                    table.push(
                        {
                            first_name: res[i].first_name,
                            last_name: res[i].last_name,
                            title: res[i].title,
                            department: res[i].name,
                        }
                    )
                }
                console.log(cTable.getTable(table))
                init();
            })
        })
}

function viewByRole() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select the department you would like to view",
                choices: ["Sales Lead", "Salesperson", "Account Manager", "Accountant", "Lead Engineer", "Software Engineer", "Legal Team Lead","Lawyer"],
                name: "task"
            }
        ]).then(({ task }) => {
            connection.query(`
            SELECT employee.first_name, employee.last_name, role.title, department.name
            FROM employee
            INNER JOIN role ON role.id = employee.role_id
            INNER JOIN department ON role.department_id = department.id
            WHERE role.title = ?;`, 
            [task],
            (err,res)=>{
                if (err) throw err;
                console.log(res);
                let table = [];
                for (let i in res){
                    table.push(
                        {
                            first_name: res[i].first_name,
                            last_name: res[i].last_name,
                            title: res[i].title,
                            department: res[i].name,
                        }
                    )
                }
                console.log(cTable.getTable(table))
                init();
            })
        })
}

function addEmployee () {
    roles = ["Sales Lead", "Salesperson", "Account Manager", "Accountant", "Lead Engineer", "Software Engineer", "Legal Team Lead","Lawyer"]
    inquirer
        .prompt([
            {
                type: "input",
                message:"What is the first name of the new employee",
                name: "first_name"
            },
            {
                type: "input",
                message:"What is the last name of the new employee",
                name: "last_name"
            },
            {
                type: "list",
                message: "What is the role of the new employee?",
                choices: roles,
                name: "role_id"
            }
        ])
        .then((answer)=>{
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: parseInt(roles[answer.role_id] + 1)
            },
            (err,res)=> {
                if (err) throw err;
                console.log(res);
            }
            )
        })
}