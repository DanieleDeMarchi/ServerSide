var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const path = require('path')


require('./db/db');

var eventsRouter = require('./routes/events');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/projects');
var comuniRouter = require('./routes/comuni');
var ruoliRouter = require('./routes/ruoli');
var viewRouter = require('./client/gestioneRuoloSindaco');


var app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './client/views'));
app.use(express.static(path.join(__dirname, '/client/public')));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);
app.use('/comuni', comuniRouter);
app.use('/gestione_ruoli', ruoliRouter);

app.use('/client', viewRouter);

app.use('/test', function(req, res, next) {
    res.send("This is the featureBranch")
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // send error 
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;
