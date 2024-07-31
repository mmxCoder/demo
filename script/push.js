const process = require("child_process");
const path = require("path");

// 推送代码
function pushCode() {
  const options = {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8",
    maxBuffer: 0,
  };

  process.execSync("git pull", options);
  process.execSync("git add .", options);
  process.execSync(`git commit -m "feat: auto push code"`, options);
  process.execSync("git push", options);

  console.log("代码推送成功");
}

pushCode();
