const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

app.use(express.json());
app.use(cors()); //cors origin resource sharing - allows us to make requests from the front end to the back end. If not used, the front end will not be able to make requests to the back end. and may rise security issues too.

const db =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Theod@2093',
    database : 'sys'
})

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected');
})

app.post('/new-task', (req, res) => {
    //const { task } = req.body;
    console.log(req.body);
    //res.send('Task received');
    const q = 'INSERT INTO todo (task, DateTime) values (?, ?)';    
    db.query(q, [req.body.task, new Date()], (err, result) => {
        if(err){
            throw err;
            console.log(err);
        }
        res.send('Task added to the database');
    }) 
    //(err, result) is the callback function.
})

app.route('/read-tasks', (req, res) => {
    const q = 'SELECT * FROM todo';
    db.query(q, (err, result) => {
        if(err){
            throw err;
            console.log(err);
        }
        res.send(result);
        console.log(result);
    })
})

app.listen(5000, () => {console.log('Server is running on port 5000')});