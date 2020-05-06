var express = require('express');
var Todo = require('./controllers/todoController');
var User = require('./controllers/userController');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://root:root@todoapp-shard-00-00-auvn5.mongodb.net:27017,todoapp-shard-00-01-auvn5.mongodb.net:27017,todoapp-shard-00-02-auvn5.mongodb.net:27017/test?ssl=true&replicaSet=ToDoApp-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true });

var urlencodedParser = bodyParser.urlencoded({extended: false});

var app = express();
app.set('view engine', 'ejs');

app.use(require('express-session')({
	secret: "I love my girlfriend a lot",
	resave: false,
	saveUninitialized: false
}));
app.use(express.static('./public'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req,res){
	res.render('index');
});

app.get("/signup", function(req,res){
	res.render('signup');
});

app.post("/signup", urlencodedParser, function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render('signup');
		}
		passport.authenticate("local")(req,res, function(){
			res.redirect("/signup");
		});
	});
});

app.get("/login", urlencodedParser, function(req,res){
	res.render('login');
});

app.post("/login", urlencodedParser, passport.authenticate("local",{
	successRedirect: "/todo",
	failureRedirect: "/login"
}), function(req,res){
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.get("/logout", urlencodedParser, function(req,res){
	req.logout();
	res.redirect("/");
});

app.get('/todo', isLoggedIn, function(req, res){
	var usern = req.user.username;
	Todo.find({user: req.user.username}, function(err,data){
		if(err) throw err;
		res.render('todo',{todos:data, user:usern});
	});
});

app.post('/todo', urlencodedParser, function(req, res){
	new Todo({item: req.body.item, user: req.user.username}).save(function(err,data){
		if (err) throw err;
		res.json(data.item);
	});
});

app.delete('/todo/:item', function(req, res){
	Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
		if (err) throw err;
		res.json(data);
	});
});

app.get('/about', function(req,res){
	res.render('about');
});

app.get('/contact', function(req,res){
	res.render('contact');
});

app.listen(3000);
console.log("We're on in port 3000!");