const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

app.use(express.json());
app.use(cors()); //cors origin resource sharing - allows us to make requests from the front end to the back end.

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Theod@2093',
    database: 'sys'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

app.post('/new-task', (req, res) => {
    console.log(req.body);
    const q = 'INSERT INTO todo (task, DateTime) values (?, ?)';
    db.query(q, [req.body.task, new Date()], (err, result) => {
        if (err) {
            console.error('Error adding task:', err);
            return res.status(500).send('Error adding task');
        }
        res.send('Task added to the database');
    });
});

app.post('/edit-task', (req, res) => {
    console.log('Backend received data:', req.body); // Log to inspect incoming data

    const { updateId, updateTask, updateDescription } = req.body;

    if (!updateTask || !updateDescription) {
        console.error('Task and Description are required!');
        return res.status(400).send('Task and Description are required');
    }

    const q = 'UPDATE todo SET task = ?, Description = ? WHERE id = ?';
    db.query(q, [updateTask, updateDescription, updateId], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).send('Error updating task');
        } else {
            console.log('Task updated successfully.');
            res.send(result);
        }
    });
});

app.get('/read-tasks', (req, res) => {
    const q = 'SELECT * FROM todo';
    db.query(q, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).send('Error fetching tasks');
        }
        console.log('Fetched tasks');
        res.send(result);
    });
});

app.delete('/delete-task', (req, res) => {
    console.log('Received id:', req.body.id); 
    const q = 'DELETE FROM todo WHERE id = ?';
    db.query(q, [req.body.id], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).send('Error deleting task');
        }
        console.log('Task deleted successfully');
        db.query('SELECT * FROM todo', (e, newList) => {
            if (e) {
                console.error('Error fetching updated tasks:', e);
                return res.status(500).send('Error fetching updated tasks');
            }
            res.send(newList);
        });
    });
});

app.post('/complete-task', (req, res) => {
    console.log('Received id:', req.body.id);
    const q = 'UPDATE todo SET status = ? WHERE id = ?';
    db.query(q, ['completed', req.body.id], (err, result) => {
        db.query('SELECT * FROM todo', (e, newList) => {
            if (e) {
                console.error('Error fetching updated tasks:', e);
                return res.status(500).send('Error fetching updated tasks');
            }
            res.send(newList);
        });
        res.send(result);
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
