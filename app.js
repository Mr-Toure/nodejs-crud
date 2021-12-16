const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const req = require('express/lib/request');
const Connection = require('mysql/lib/Connection');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//parsing middleware
app.use(bodyParser.urlencoded({ extended:false }));

//parse application/json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

// Templating Engine
const hbs = exphbs.create({
    extName: '.hbs',
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main.hbs'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
//app.set('views', './views');


//Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});

//connect to database
pool.getConnection((err, connection) => {
    if (err) throw err; //not connect
    console.log('connected as ID '+ connection.threadId);
});

const routes = require('./server/routes/user');

app.use('/', routes);


app.listen(port, () => console.log("ecoute le port "+port));