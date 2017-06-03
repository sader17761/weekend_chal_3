/* SERVER SIDE SCRIPT */

// requires
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

// global variables
var port = 8000;
var config = {
  database: 'todoDB',
  host: 'localhost',
  port: 5432, // this is the default port for localhost postgres database
  max: 10
};

var pool = new pg.Pool(config);

// uses
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// spin up SERVER
app.listen(port, function(){
  console.log('The Server Is Up On Port: ', port);
}); // end of server spin up

// base url
app.get('/', function(req, res){
  console.log('We are in the base url.');
  res.sendFile(path.resolve('views/index.html'));
}); // end fo base url

// get route
app.get( '/todos', function( req, res ){
  console.log( 'We hit the /todos GET.' );
  // connect to db
  pool.connect( function( err, connection, done ){
    if( err ){
      console.log( 'Error conencting to the todoDB' );
      done();
      res.send( 'VOMIT!' );
    } // end Error
    else{
      console.log( 'YEAH! Were connected to the todoDB.' );
      var allTodos = [];
      // create our query string
      // tell db to run query
      // hold results in variable
      var resultSet = connection.query( 'SELECT * from todoTable ORDER BY user_id ASC' );
      resultSet.on( 'row', function( row ){
        // loop through result set and push each row into an array
        allTodos.push( row );
      }); // end
      resultSet.on( 'end', function(){
        // close connection
        done();
        // send back data
        res.send( allTodos );
      });
    } // end no error
  }); // end pool connect
}); // end /todos get

// post route
app.post( '/todos', function( req, res ){
  console.log( 'We got a post hit in /todos:', req.body );
  pool.connect(function(err, connection, done){
    if(err){
      console.log('We have an error: ', err);
      done();
      res.send(400);
    } else {
      console.log('WOO HOO, were connected to the DataBase.');
      connection.query("INSERT INTO todoTable (todo, completed) VALUES ($1, $2)", [req.body.todoItem, req.body.todoComplete]);
    }
  });
  res.send( 'YOU DID IT!' );
});

// delete route
app.delete( '/todos', function( req, res ){
  console.log( 'We got a DELETE hit in /todos:', req.body );
  pool.connect(function(err, connection, done){
    if(err){
      console.log('We have an error: ', err);
      done();
      res.send(400);
    } else {
      console.log('WOO HOO, were connected to the DataBase.');
      connection.query("DELETE FROM todoTable WHERE todo = '" + req.body.todoItem + "';");
    }
  });
  res.send( 'YOU DID IT!' );
});

// post update route
app.post( '/update', function( req, res ){
  console.log( 'We got a UPDATE hit in /update:', req.body );
  pool.connect(function(err, connection, done){
    if(err){
      console.log('We have an error: ', err);
      done();
      res.send(400);
    } else {
      console.log('AMAZING, were connected to the DataBase.');
      connection.query("UPDATE todoTable SET completed = " + req.body.isCompleted + " WHERE todo = '" + req.body.todoItem + "';");
    }
  });
  res.send( 'WE UPDATED THE DATABASE!' );
});
