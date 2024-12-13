const { check, validationResult } = require('express-validator');

module.exports = (app, client, bcrypt, mod, user) => {
  //login page error messages
  var user = {
    username: "",
    state: false,
  };

  //render login page
  app.get("/login", (req, res) => {
    if (req.session.isLoggedIn == true) {
      res.redirect("/");
    } else {
      user.username = req.session.username;
      user.state = req.session.isLoggedIn;

      console.log(
        req.sessionID +
          ", " +
          req.session.isLoggedIn +
          ", " +
          req.session.username,
      );

      res.render("login.ejs", {user});
    }
  });

  validateChain = [
    check('username')
      .isLength({min:5}).withMessage('username min length is 5 chars')
      .isLength({max:35}).withMessage('username max length is 35 chars')
      .isAlphanumeric().withMessage('username must be alphanumeric'),
    check('password')
      .isLength({min:5}).withMessage('password min length is 5 chars')
  ]

  //process log in
  app.post("/loginAuthentication", validateChain,async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMes = errors.array()[0].msg;
      return res.json(`{"success":"false", "erm":"${errorMes}"}`)
    } else {

    var username = req.sanitize(req.body.username);
    var password = req.sanitize(req.body.password);

    var query = "SELECT * FROM users WHERE username = $1";
    var values = [username];
    var result = await client.query(query, values);

    //check if username exist
    if (result.rows.length == 0) {
      //not exist
      res.json('{"success":"false", "erm":"username not found"}')
    } else if (result.rows.length == 1) {
      //exist
      await bcrypt.compare(
        password,
        result.rows[0].pass,
        (err, compareResult) => {
          if (err) {
            res.json('{"success":"false", "erm":"bad login"}')
          }
          if (compareResult == false) {
            // wrong password
            res.json('{"success":"false", "erm":"wrong password"}')
          }
          if (compareResult == true) {
            //correct password
            req.session.username = username;
            req.session.isLoggedIn = true;
            res.json('{"success":"true", "erm":"login successful. redirect in "}')
          }
        },
      );
    }
  }//eos
  });


  validateChain2 = [
    check('reg_username')
      .isLength({min:5}).withMessage('username min length is 5 chars')
      .isLength({max:35}).withMessage('username max length is 35 chars')
      .isAlphanumeric().withMessage('username must be alphanumeric'),
    check('reg_password')
      .isLength({min:5}).withMessage('password min length is 5 chars')
  ]

  //process register
  app.post("/registerAuthentication",validateChain2,async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMes = errors.array()[0].msg;
      return res.json(`{"success":"false", "erm":"${errorMes}"}`)
    }

    var username = req.sanitize(req.body.reg_username);
    var password = req.sanitize(req.body.reg_password);
    var password2  = req.sanitize(req.body.reg_password2);

    usernameAlready = async (searchthis) => {
      var query_usernameRepeatCheck = "SELECT 1 FROM users WHERE username = $1 LIMIT 1;";
      var values = [searchthis]
      result = await client.query(query_usernameRepeatCheck, values)
      if (result.rows.length > 0){return true}
      else {return false}
    }


    if (await usernameAlready(username) == true) {
      res.json('{"success":"false", "erm":"username already exists"}')
    }
    else if (password != password2) {
      res.json('{"success":"false", "erm":"passwords do not match"}')
    } 
    else {
      try {
        bcrypt.hash(password, 10, async (err, hash) => {
          var query = "INSERT INTO users(username, pass) VALUES($1,$2) RETURNING *";
          var values = [username, hash];
          result = await client.query(query, values);
          if (result.rows.length > 0) {
            res.json('{"success":"true", "erm":"registered successfully"}')
          }
          else if (result.rows.length = 0){
            res.json('{"success":"false", "erm":"fail to create account, try again later."}')
          }
        });
      } catch (error) {
        console.log(error)
        res.json('{"success":"false", "erm":"fail to create account, try again later."}')
      }
    }
  });

  //process logout
  app.get("/logout", async (req, res) => {
    req.session.isLoggedIn = false; //set session state
    req.session.username = mod.visitNameGen(); //set session name

    res.redirect("back");
  });

};
