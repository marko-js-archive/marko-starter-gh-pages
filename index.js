const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const ghpages = require("gh-pages");
const rimraf = require("rimraf");
const generateRedirects = require("./generateRedirects");
const globAsync = promisify(require("glob"));
const readFileAsync = promisify(fs.readFile);

const DEFAULT_BUILD_DIR = "dist";

function writeFileAsync(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      return err ? reject(err) : resolve();
    });
  });
}

function publishAsync(buildDir, config) {
  return new Promise((resolve, reject) => {
    ghpages.publish(buildDir, config, err => {
      return err ? reject(err) : resolve();
    });
  });
}

function rimrafAsync (dir) {
  return new Promise((resolve, reject) => {
    rimraf(dir, function (err) {
      return err ? reject(err) : resolve();
    });
  });
}

function discoverProjectFile(projectDir) {
  let projectPath;

  try {
    projectPath = path.join(projectDir || process.cwd(), "project.js");
    project = require(projectPath);
  } catch (err) {
    console.error(
      `Error loading marko-starter "project.js" module at path "${projectPath}".`
    );
    throw err;
  }

  return project;
}

function cleanObject(obj) {
  const newObj = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      newObj[key] = value;
    }
  }

  return newObj;
}

exports.publish = async function(options = {}) {
  let {
    buildDir,
    projectDir,
    buildConfig,
    baseUrl,
    redirects,
    branch,
    dest,
    repo,
    remote,
    tag,
    message
  } = options;

  buildDir = buildDir || DEFAULT_BUILD_DIR;
  projectDir = projectDir || process.cwd();

  // dest = dest || path.join(buildDir, "__publish");
  console.log("Using project directory: ", projectDir);

  project = discoverProjectFile(projectDir);

  // await execLogged("markoc . --clean", projectDir);
  await rimrafAsync(path.join(projectDir, ".cache"));

  await project.build(buildConfig);

  if (baseUrl) {
    const files = await globAsync(`${buildDir}/**/*.html`);

    for (const filePath of files) {
      let html = await readFileAsync(filePath, "utf8");
      html = html.replace(/src="\//g, `src="${baseUrl}/`);
      html = html.replace(/href="\//g, `href="${baseUrl}/`);
      await writeFileAsync(filePath, html);
    }
  }

  if (options.redirects) generateRedirects(redirects);
  if (options.beforePublish) beforePublish();

  return publishAsync(
    buildDir,
    cleanObject({
      branch,
      dest,
      repo,
      remote,
      tag,
      message
    })
  );
};
