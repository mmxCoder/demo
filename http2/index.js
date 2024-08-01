const spdy = require("spdy");
const express = require("express");
const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    if (res.push) {
      ["/app.js"].forEach(async (file) => {
        res.push(file, {}).end(await readFile(`public${file}`));
      });
    }

    console.log("执行了...");

    res.writeHead(200);
    res.end(await readFile("index.html"));
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

spdy
  .createServer(
    {
      key: fs.readFileSync("./key/server.key"),
      cert: fs.readFileSync("./key/server.crt"),
    },
    app
  )
  .listen(3001, (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log("Listening on port 3001");
  });
