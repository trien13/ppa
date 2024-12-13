

module.exports = (app, client, data, mod) => {
  var user = {
    username: "",
    state: false,
  };

  app.get("/", async (req, res) => {

     if (req.session.isLoggedIn == false || req.session.isLoggedIn == null) {
      if(req.session.username == null) {
        req.session.username = mod.visitNameGen()
      }
      req.session.isLoggedIn = false
    }
    
    user.username = req.session.username;
    user.state = req.session.isLoggedIn;
   
    query1 ="SELECT * FROM book;"
   
    const results_topic_found = await client.query(query1);

    let bundle = Object.assign({}, data, {
      topics: results_topic_found.rows,
      user,
    });

    res.render("book.ejs", bundle);

  });

  app.post("/addingTopic", async (req, res) => {
    const topic =  req.sanitize(req.body.topicName);
    queryValueShout = topic + "_shouts"
    queryValueThread = topic + "_threads"

    var query = "SELECT * FROM book WHERE topics = $1";
    var values = [topic];
    var resultCE = await client.query(query, values);

    if (resultCE.rows.length == 1) {
       res.json('{"success":"false", "erm":"Topic already existed! "}')
    } else if (resultCE.rows.length == 0) {
      const query1 = `
        CREATE TABLE IF NOT EXISTS ${queryValueThread} (
          threads_numero SERIAL PRIMARY KEY,
          threads_title TEXT NOT NULL,
          threads_username TEXT NOT NULL,
          threads_content TEXT NOT NULL,
          threads_color TEXT[] DEFAULT NULL,
          threads_reply TEXT[] DEFAULT NULL,
          threads_timeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          threads_lastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);`;

      const query2 = `
          CREATE TABLE IF NOT EXISTS ${queryValueShout} (
          time TIME DEFAULT CURRENT_TIME NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          username TEXT NOT NULL,
          shout TEXT NOT NULL);`;

      try {
        result1 = await client.query(query1);
        result2 = await client.query(query2);

        var query = "INSERT INTO book(topics) VALUES($1) RETURNING *";
        var values = [topic];
        result = await client.query(query, values);

        res.json('{"success":"true", "erm":"Topic create successful! Auto refresh in "}')
      } catch (error) {
        console.log(error)
        res.json('{"success":"false", "erm":"Error. please try again"}')
      }
  }

  });

  
};
