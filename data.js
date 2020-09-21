const fs = require("fs");
const crypto = require("crypto");
const GIT_DIR = ".git-js";

function sha1sum(string) {
  return crypto.createHash("sha1").update(string).digest("hex");
}

function init(directory) {
  fs.mkdirSync(directory + "/" + GIT_DIR);
  fs.mkdirSync(directory + "/" + GIT_DIR + "/objects");
}

function hash_object(repository, data, type = "blob") {
  data = type.concat("\0").concat(data);
  const oid = sha1sum(data);
  fs.writeFileSync(repository + "/" + GIT_DIR + "/objects/" + oid, data);
  return oid;
}

function get_object(directory, oid, expected = "blob") {
  let obj = fs.readFileSync(directory + "/" + GIT_DIR + "/objects/" + oid);
  let first_null = obj.indexOf(0);
  let type = obj.slice(0, first_null);
  let content = obj.slice(first_null + 1);

  if (expected && expected != type) {
    console.error(`Expected ${expected}, got ${type}`);
    process.exit(-1);
  }

  return content;
}

module.exports = { init, hash_object, get_object };
