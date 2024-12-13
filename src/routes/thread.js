const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();

module.exports = function (app, client, user, data) {
  var dummyData = require("./data.json");

  var user = {
    username: "",
    state: false,
  };

  app.get("/:topic/:numero", async (req, res) => {
    user.username = req.session.username
    user.state = req.session.isLoggedIn;
    numero = req.params.numero
    topic = req.params.topic

    queryValueThread = topic + "_threads"

    const query = {
      text: `SELECT threads_title, threads_username, threads_content, threads_numero, threads_color, threads_reply 
        FROM ${queryValueThread} 
        WHERE threads_numero = $1`,
      values: [numero]
    }
   
    const results_thread_found = await client.query(query);

    let bundle = Object.assign({}, data, {
      emo: dummyData.emo,
      thread: results_thread_found.rows,
      user,
    });

    res.render("thread.ejs", bundle);
  })

  app.post("/submitReply", async (req, res) => {
    submit_username = req.body.reply_username
    submit_content = req.body.reply_content.trim()
    submit_parent = req.body.reply_parent
    submit_numero = req.body.reply_numero
    submit_topic = req.body.reply_topic

    queryValueThread = submit_topic + "_threads"

    submit_string = `["`+submit_username + `",`+ JSON.stringify(submit_content) + `,"`+ submit_parent + `"]` 
    const query = {
      text:
      `UPDATE ${queryValueThread}
      SET threads_reply = array_append(threads_reply, $1)
      WHERE threads_numero = $2;`,
      values: [submit_string, submit_numero]
    }
    query2 = {
      text:
      `UPDATE ${queryValueThread}
      SET threads_lastactive = CURRENT_TIMESTAMP
      WHERE threads_numero = $1;`,
      values: [submit_numero]
    }
    const results_submit_reply = client.query(query)
    const results2 = client.query(query2)
    //sse trigger
    eventEmitter.emit("pushReply", submit_string);
    res.end()
  })  

  app.get("/sse-thread", async (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    //push new reply to front
    const pushReply = async (data) => {
      const eventData = data;
      await res.write(`data: ${eventData}\n\n`);
    };

    //trigger
    eventEmitter.on("pushReply", pushReply);

    req.on("close", () => {
      eventEmitter.removeListener("pushReply", pushReply);
    });
  });

};
