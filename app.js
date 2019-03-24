var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodeoutlook = require('nodejs-nodemailer-outlook');
var mongoose = require('mongoose');

//mongoose

var urlencodedParser = bodyParser.urlencoded({ extended: false });
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req,res){
	res.render('index');
});
app.get('/signin', function(req,res){
    res.render('signin');
});
app.get('/signup', function(req,res){
    res.render('signup');
});
app.post('/signup', urlencodedParser, function(req,res){
	if(req.body.name == '' || req.body.university == '' || req.body.email == '' || req.body.password == '' || req.body.varifyPassword == ''){
		res.render('signupAlert');
	}
	else if(req.body.password !== req.body.varifyPassword){
        res.render('signupPasswordAlert');
	}
	else if(req.body.email != undefined){
		localStorage.setItem('varCode', Math.floor(Math.random()*90000) + 10000);
		nodeoutlook.sendEmail({
		auth : {
			user : 'James.Day@cgs.act.edu.au',
			pass : 'DAYTrustno23'
		},
		from : 'James.Day@cgs.act.edu.au',
		to : req.body.email,
		subject : 'GPI - Varification Code',
		html : '<p>Dear ' + req.body.name + ', </p>' + '<p>Your varification code is... </p>' + localStorage.getItem('varCode')
	});
	res.render('varificationDisplay');
}
	else if (req.body.varification == localStorage.getItem('varCode')){
		res.render('successVarify')
	}
	else{
		res.render("unsuccessVarify");
	}
});
app.get('/profile/:id', function(req,res){
    res.render('profile', {person: req.params.id});
});
app.listen(2310);