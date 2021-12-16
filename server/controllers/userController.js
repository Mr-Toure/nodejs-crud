const mysql = require('mysql');

//Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});

//view users
exports.view = (req, res) => 
{
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        //User the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err,rows) => 
        {
            //when donne with connection release it
            connection.release();

            if(!err){
                let removedUser = req.query.removed;
                res.render('home', { rows, removedUser });
            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
};

//find by seach

exports.find = (req, res) => {
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        let searchTerm = req.body.search;

        //User the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            //when donne with connection release it
            connection.release();
            if(!err){
                res.render('home', { rows });
            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
}

//show interface add new user
exports.form = (req, res) => {
    res.render('add-user');
}


//Add user in database
exports.create = (req, res) =>{
    const {first_name, last_name, email, phone, comments } = req.body;
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        let searchTerm = req.body.search;

        //User the connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, comment = ?, phone = ?', [first_name, last_name, email, comments, phone], (err, rows) => {
            //when donne with connection release it
            connection.release();
            if(!err){
                res.render('add-user', { alert: 'User Added Successfuly.'});
            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
}

//Edit interface add new user
exports.edit = (req, res) => {
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        //User the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err,rows) => 
        {
            //when donne with connection release it
            connection.release();

            if(!err){
                res.render('edit-user', { rows });
            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
}

//update interface add new user
exports.update = (req, res) => {

    const {first_name, last_name, email, phone, comments } = req.body;
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        //User the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, comment = ?, phone = ? WHERE id = ?', [first_name, last_name, email, comments, phone, req.params.id], (err,rows) => 
        {
            //when donne with connection release it
            connection.release();

            if(!err){
                //connect to database
                pool.getConnection((err, connection) => 
                {
                    if (err) throw err; //not connect
                    console.log('connected as ID '+ connection.threadId);

                    //User the connection
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err,rows) => 
                    {
                        //when donne with connection release it
                        connection.release();

                        if(!err){
                            res.render('edit-user', { rows, alert: "Data updated Successfuly." });
                        }else{
                            console.log(err);
                        }
                        console.log('The data From user table: \n', rows);
                    });
                });

            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
}

//delete user
exports.delete = (req, res) => {
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        //User the connection
        connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err,rows) => 
        {
            //when donne with connection release it
            connection.release();

            if(!err){
                let rm = encodeURIComponent('User successefuly removed')
                 res.redirect('/?removed=' + rm);
            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
}


//view user
exports.viewall = (req, res) => 
{
    //connect to database
    pool.getConnection((err, connection) => 
    {
        if (err) throw err; //not connect
        console.log('connected as ID '+ connection.threadId);

        //User the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err,rows) => 
        {
            //when donne with connection release it
            connection.release();

            if(!err){
                res.render('view-user', { rows });
            }else{
                console.log(err);
            }
            console.log('The data From user table: \n', rows);
        });
    });
};