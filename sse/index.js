// import express from "express";
const express = require("express");

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

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.status(200);
  setInterval(() => {
    res.write("event:" + (Math.random() > 0.5 ? "hello" : "world") + "\n");
    res.write("id: 111\n");
    res.write("retry: 500\n");
    res.write("data: " + new Date().getTime() + "\n");
    res.write("data: " + "hello world" + "\n\n");
  }, 500);
});

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
