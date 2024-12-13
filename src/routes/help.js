module.exports = function (app, data) {
  var user = {
    username: "",
    state: false,
  };

  app.get("/help", (req, res) => {
    user.username = req.session.username;
    user.state = req.session.isLoggedIn;
    res.render("help.ejs", { user });
  });
};
