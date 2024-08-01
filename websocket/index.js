const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });
  ws.send("Hello! Message From Server!!");
});

console.log("ws服务已启动, 端口号: 3001");
