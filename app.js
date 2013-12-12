var express = require("express"),
	util = require("util");
	RedisStore = require('connect-redis')(express),
	router = require("./router"),
	flash = require('connect-flash'),
	config = require("./config"),
	bcrypt = require("bcrypt"),
	app = express(),
	MemStore = express.session.MemoryStore;

GLOBAL.Q = require("q");

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine("html", require("ejs").renderFile);
	app.set("view options", {layout:false});
	app.use(express.static(__dirname + "/public"));
	app.use(express.favicon());
	app.use(express.bodyParser());

	app.use(express.cookieParser(config.sessionSecret || "Hallo"));	
	app.use(express.session({store: new RedisStore()}));
	app.use(flash());
});
//test

router.call(app);
app.listen(config.port || 3000);