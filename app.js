const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MulterError = require('multer').MulterError

require('./db/db');
const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/events', eventsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log("404 catch")
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


// error handler
app.use(function(err, req, res, next) {
    console.log("Error handler")

    if (err instanceof MulterError) {
        res.status(400).send(err.message)
    } else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.send(err.message);
    }
    

});

module.exports = app;
