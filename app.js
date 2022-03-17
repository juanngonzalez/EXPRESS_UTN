var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usRouter = require('./routes/us');
var newsRouter = require('./routes/news');
var contactRouter = require('./routes/contact');
var loginRouter = require('./routes/pseudo_login')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'12345678912345678912',
  resave:false,
  saveUninitialized:true
}))

app.get('/pseudo_login', function (req,res){
  var conocido = Boolean(req.session.nombre)

  res.render('pseudo_login',{
    title:'sessiones en express',
    conocido: conocido,
    nombre: req.session.nombre
  })
})

app.post('/pseudo_login',function(req,res){
  if(req.body.nombre){
    req.session.nombre = req.body.nombre
  }
  res.redirect('/pseudo_login')
})

app.get('/salir',function(req,res){
  req.session.destroy();
  res.redirect('/pseudo_login')
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/us',usRouter);
app.use('/news',newsRouter);
app.use('/contact',contactRouter);
app.use('/pseudo_login',loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
