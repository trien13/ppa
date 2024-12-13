require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cors = require("cors");
const pg = require("pg");
const bcrypt = require('bcrypt');
const session = require('express-session')
const mod = require("./src/routes/modules.js")
const validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

app.use(session({
  secret: process.env.SESHSECRET,
  cookie: { maxAge: 1000*60*60*24, secure: false}, // secure true only with https
  resave: false,
  saveUninitialized: true,
}))

//database stuff
var connectionString = "pg://postgres:123@localhost:5432/hemb";
var client = new pg.Client(connectionString)
dbinit = async () => {
  await client.connect((err)=> {
    if (err) {console.log(err)}
    else {console.log("Connected to the database")};
  })
}

dbinit()

// parse req body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// set ejs as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// serving all static assets from /src
app.use(express.static("src"));

// css
app.use(express.static(path.join(__dirname, "public")));

//get routes from files
require("./src/routes/home")(app, data, client, mod);
require("./src/routes/help")(app);
require("./src/routes/login")(app, client, bcrypt, mod, );
require("./src/routes/thread")(app, client, data);
require("./src/routes/book")(app, client, data, mod);

var data;

console.clear();

// start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
