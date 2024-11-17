const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); //cors origin resource sharing - allows us to make requests from the front end to the back end. If not used, the front end will not be able to make requests to the back end. and may rise security issues too.

app.post('/new-task', (req, res) => {
    const { task } = req.body;
    console.log(task);
    res.send('Task received');
})

app.listen(5000, () => {console.log('Server is running on port 5000')});