const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

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

app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, filename } = req.file;
  const { index, totalChunks } = req.body;

  const tempPath = path.join(__dirname, "uploads", filename);
  const targetPath = path.join(__dirname, "uploads", originalname);

  fs.renameSync(
    tempPath,
    path.join(__dirname, "uploads", `${originalname}.part${index}`)
  );

  if (parseInt(index) === parseInt(totalChunks) - 1) {
    // Last chunk, merge all chunks
    const writeStream = fs.createWriteStream(targetPath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(
        __dirname,
        "uploads",
        `${originalname}.part${i}`
      );
      const chunkBuffer = fs.readFileSync(chunkPath);
      writeStream.write(chunkBuffer);
      fs.rmSync(chunkPath);
    }

    writeStream.end();
    res.json({ message: "File uploaded successfully" });
  } else {
    // Rename chunk to include part number
    res.json({ message: "Chunk uploaded successfully" });
  }
});

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 文件将被保存在'uploads/'目录
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload1 = multer({ storage: storage });

app.post("/uploadWithNotSplit", upload1.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
