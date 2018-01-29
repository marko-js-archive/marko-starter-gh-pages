const argly = require("argly");
const markoPages = require("../");

exports.run = function(argv) {
  argv = argv.slice(2);

  const args = argly
    .createParser({
      "--build-dir -b": {
        type: "string",
        description:
          'Directory where the built files will reside. Defaults to "./dist"'
      },
      "--project-dir -p": {
        type: "string",
        description:
          'Directory of the project.js file. Defaults to "process.cwd()"'
      },
      "--base-url -u": {
        type: "string",
        description: "Base URL for the page (e.g. /my-project)"
      },
      "--redirects -e": {
        type: "string[]",
        description:
          "List of URLs to redirect and where to redirect to (--redirects /docs/home /docs)"
      },
      "--branch -B": {
        type: "string",
        description: 'Branch to push to (defaults to "gh-pages")'
      },
      "--dest -d": {
        type: "string",
        description:
          "The folder to publish to do n the destination branch. Defaults to the root of the repository."
      },
      "--repo -r": {
        type: "string",
        description:
          'Repository to push to. Defaults to the current working directory with "origin" remote.'
      },
      "--remote -R": {
        type: "string",
        description: 'Name of the remote to push to (defaults to "origin")'
      },
      "--tag -t": {
        type: "string",
        description:
          "Git tag to create with the build. None created if not used."
      },
      "--message -m": {
        type: "string",
        description: 'Commit message (defaults to "Updates")'
      },
      "--help -h": {
        type: "string",
        description: "Show all properties"
      }
    })
    .usage("Usage: $0 [options]")
    .example(
      "With a commit message",
      'marko-starter-gh-pages -m "Hello this is my commit!"'
    )
    .example(
      "With redirects",
      "marko-starter-gh-pages -e /docs/home /docs /admin/home /admin"
    )
    .validate(function(result) {
      if (result.help) {
        this.printUsage();
        process.exit(0);
      }

      if (result.redirects) {
        if (result.redirects.length % 2 !== 0) {
          throw new Error('"redirects" must all have a key/value pair');
        }

        const newRedirects = {};

        for (let i = 1; i < result.redirects.length; i += 2) {
          const key = result.redirects[i];
          const value = result.redirects[i - 1];
          newRedirects[key] = value;
        }

        result.redirects = newRedirects;
      }
    })
    .onError(function(err) {
      this.printUsage();
      console.error(err);
      process.exit(1);
    })
    .parse(argv);

  return markoPages.publish(args);
};
