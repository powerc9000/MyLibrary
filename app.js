var express = require("express");
var RedisStore = require('connect-redis')(express)
var app = express();
var MemStore = express.session.MemoryStore;
var router = require("./router");
var flash = require('connect-flash');
var config = require("./config")
var bcrypt = require("bcrypt");
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