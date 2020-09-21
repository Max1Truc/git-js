const url = require("url");
const fs = require("fs");
const data = require("./data");

function is_ignored(path) {
  return path.split("/").indexOf(".git-js") != -1
}

function clone(repository, directory) {
  let parsedUrl = url.parse(repository + "/info/refs?service=git-upload-pack");
  fs.mkdirSync(directory, { recursive: true });
  data.init(directory);
}

function hash_object(repository, filename) {
  let file_data = fs.readFileSync(filename);
  return data.hash_object(repository, file_data);
}

function write_tree(repository = ".", directory = ".") {
  let tree_object = "";
  for (let entry of fs.readdirSync(directory)) {
    const full_path = `${directory}/${entry}`;

    if (!is_ignored(full_path)) {
      let stat = fs.statSync(full_path);

      if (stat.isFile()) {
        let oid = hash_object(repository, full_path);
        tree_object += `blob ${oid} ${entry}\n`;
      } else if (stat.isDirectory()) {
        let oid = write_tree(repository, full_path);
        tree_object += `tree ${oid} ${entry}\n`;
      }
    }
  }

  return data.hash_object(repository, tree_object, "tree");
}

module.exports = { clone, hash_object, get_object: data.get_object, write_tree };
