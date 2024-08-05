const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

// 获取文件大小
app.get("/getFileInfo", (req, res) => {
  const info = fs.statSync(path.join(__dirname, `assets/${req.query.name}`));
  res.setHeader("Content-Type", "application/json");
  res.json({ message: "名称大小获取成功", data: { size: info.size } });
});

// 获取分片文件
app.get("/getChunk", (req, res) => {
  const name = req.query.name;
  const paths = path.join(__dirname, "assets", name);
  const size = fs.statSync(path.join(__dirname, `assets`, req.query.name)).size;

  const h = req.headers["range"];
  const [start, end] = h.split("=")[1].split("-");

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "application/octet-stream",
  });
  fs.createReadStream(paths, {
    start: Number(start),
    end: Number(end),
  }).pipe(res);
});

// 获取文件(不分片)
app.get("/getFile", (req, res) => {
  res.status(200);
  fs.createReadStream(path.join(__dirname, "assets", req.query.name)).pipe(res);
});

app.listen(3001, () => {
  console.log("服务已启动, 请访问: http://localhost:3001");
});
