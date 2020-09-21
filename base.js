const url = require("url");
const fs = require("fs");
const data = require("./data");

function clone(repository, directory) {
  let parsedUrl = url.parse(repository + "/info/refs?service=git-upload-pack");
  fs.mkdirSync(directory, { recursive: true });
  data.init(directory);
}

function hash_object(repository, filename) {
  let file_data = fs.readFileSync(filename);
  return data.hash_object(repository, file_data);
}

module.exports = { clone, hash_object, get_object: data.get_object };
