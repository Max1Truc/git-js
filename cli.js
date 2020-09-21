const argv = require("minimist")(process.argv.slice(2));
const lib = require("./base");
const fs = require("fs");
const rimraf = require("rimraf").sync;

if (argv._[0] == "clone" && argv._[1]) {
  const cloneUrl = argv._[1];
  let clonePath = argv._[2];

  if (!clonePath) {
    let splittedUrl = cloneUrl.split("/");
    let lastUrlDirectory = splittedUrl[splittedUrl.length - 1];
    clonePath = lastUrlDirectory.split(".")[0];
  }

  let clonePathExists = fs.existsSync(clonePath);
  const shouldForce = argv.f || argv.force;

  if (shouldForce && clonePathExists) {
    rimraf(clonePath);
    clonePathExists = false;
  }

  if (!clonePathExists) {
    lib.clone(cloneUrl, clonePath);
  } else {
    console.log(
      `A file or a directory already exists with this name: ${clonePath}`
    );
  }
} else if (argv._[0] == "hash-object") {
  const filename = argv._[1];
  const directory = ".";

  if (filename) {
    let fileExists = fs.existsSync(filename);

    if (fileExists) {
      console.log(lib.hash_object(directory, filename));
    } else {
      console.log(`This file does not exist: ${filename}`);
    }
  } else {
    console.log(`Please give me a file name`);
  }
} else if (argv._[0] == "cat-file") {
  const oid = argv._[1];
  const directory = ".";

  if (oid) {
    console.log(lib.get_object(directory, oid, null).toString());
  } else {
    console.log(`Please give me a sha1 hash`);
  }
} else {
  console.log(
    `Error, the only recognised commands are:
    git-js clone <repository> [<directory>] [--force]
    git-js hash-object <filename>
    git-js cat-file <object id>`
  );
}
