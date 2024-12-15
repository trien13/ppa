var emoticons = require("./data.json");
const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();

//
// template for one page
// include 1 shoutbox, 1 threads section
//
//

module.exports = (app, data, client, mod, user) => {

  //user information
  var user = {
    username: "",
    state: false,
  };

  app.get("/topic/:name", async (req, res) => {
    if (req.session.isLoggedIn == false || req.session.isLoggedIn == null) {
      if(req.session.username == null) {
        req.session.username = mod.visitNameGen()
      }
      req.session.isLoggedIn = false
    }

    user.username = req.session.username;
    user.state = req.session.isLoggedIn;

    const topic = req.params.name;
    queryValueShout = topic + "_shouts"
    queryValueThread = topic + "_threads"
    const query = {
      text: `SELECT * FROM ${queryValueShout}`,
    }

    const query2 = {
      text: `SELECT * FROM ${queryValueThread}`,
    }

    const results_oldShout = await client.query(query);
    const results_threads = await client.query(query2); 
    let bundle = Object.assign({}, data, {
      emo: emoticons.all,
      oldShout: results_oldShout.rows,
      threads: results_threads.rows,
      user: user,
      topic: topic,
    });
    res.render("index.ejs", bundle);
  });

  app.get("/api/emoticons", async (req, res) => {
    res.json(emoticons.all)
  })

  app.post("/submitShout", async (req, res) => {
    const collectionTarget = req.params.url;
    const inputData = req.body;
    const username = req.body.key1;

    var shout = req.sanitize(req.body.key2)
    var topic = req.body.key3;

    queryValueShout = topic + "_shouts"

    const query = {
      text: `INSERT INTO ${queryValueShout} (username, shout) VALUES($1,$2) RETURNING *`,
      values: [username, shout],
    }
    const results = await client.query(query);
    await eventEmitter.emit("pushShout", results);
    res.end();
  });

  app.get("/sse", async (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    setInterval(() => {
      res.write(': keep-alive\n\n'); 
      console.log("check keep alive")
    }, 15000); 

    //push new shout to front end
    const pushShout = async (data) => {
      const eventData = JSON.stringify(data.rows[0]);
      res.write(`data: ${eventData}\n\n`);
      console.log("shout sended")
    };

    //trigger
    eventEmitter.on("pushShout", pushShout);

    req.on("close", () => {
      eventEmitter.removeListener("pushShout", pushShout);
    });
  });

  //creating new thread
  app.post("/submitThread", async (req, res) => {
    var submit_username = req.body.username
    var submit_title =  req.sanitize(req.body.title)
    var submit_content =  req.sanitize(req.body.title)
    var submit_numero = await mod.threadNumberGen()
    var submit_reply = null
    var submit_topic = req.body.topic

    queryValueThread = submit_topic + "_threads"

    submit_content = check4html(submit_content)
    submit_title = check4html(submit_title)

    const query =  `INSERT INTO ${queryValueThread} (threads_title, threads_username, threads_content, threads_numero, threads_reply) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
    var values = [submit_title, submit_username, submit_content, submit_numero, submit_reply];
    var results = await client.query(query, values);
    console.log(results.rows)
    res.redirect(`/topic/${submit_topic}`)
  })



  setInterval(async () => {
    //get all topics
    const query = `SELECT * from book;`
    const results_topic = await client.query(query);
    if (results_topic.rows.length != 0) {
      for (i = 0; i < results_topic.rows.length; i++) {
        //go through all shoutboxes and delete entries accordingly
        queryValueShout = results_topic.rows[i].topics + "_shouts"
        const query2 = `DELETE FROM ${queryValueShout} WHERE CURRENT_TIMESTAMP >= "timestamp" + INTERVAL '24 hours'`;
        await client.query(query2);
        //go through all threads and delete entries accordingly
        queryValueThread = results_topic.rows[i].topics + "_threads"
        const query3 = `DELETE FROM ${queryValueThread} WHERE CURRENT_TIMESTAMP >= "threads_lastactive" + INTERVAL '24 hours'`;
        await client.query(query3);
      }
    } 
    console.log("checking....");
  }, 24*60*60*1000);

  //end of home.js
};
