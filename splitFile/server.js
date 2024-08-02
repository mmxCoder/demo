const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);

const app = express();

app.use(express.json());

const upload = multer();

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

const _savaFile = () => {
  let isExistDir = false;

  return (paths, fileName, buffer) => {
    if (!isExistDir && !fs.existsSync(paths)) {
      fs.mkdirSync(paths, { recursive: true });
      isExistDir = true;
    }

    fs.writeFileSync(path.join(paths, fileName), buffer);
  };
};

const saveFile = _savaFile();

app.post("/upload", upload.single("file"), (req, res) => {
  const { index, totalChunks, hash } = req.body;

  const tempPath = path.join(__dirname, `uploads`, hash);

  // 保存到临时目录
  saveFile(tempPath, `chunk.part${index}`, req.file.buffer);

  res.json({ message: "Chunk uploaded successfully" });
});

app.post("/merge", (req, res) => {
  const { fileName, hash, totalChunks } = req.body;

  const tempPath = path.join(__dirname, "uploads", hash);
  readdir(tempPath).then((files) => {
    if (files.length !== totalChunks) {
      res.json({ message: "文件流不完整" });
      return;
    } else {
      const targetPath = path.join(__dirname, "uploads", `${hash}.${fileName}`);
      const writeStream = fs.createWriteStream(targetPath);

      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(tempPath, `chunk.part${i}`);
        const chunkBuffer = fs.readFileSync(chunkPath);
        writeStream.write(chunkBuffer);
      }

      // 移除临时文件
      fs.rmdirSync(tempPath, { recursive: true });

      writeStream.end();
      res.json({ message: "File uploaded successfully" });
    }
  });
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
