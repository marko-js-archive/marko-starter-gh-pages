# marko-starter is deprecated, check out [@marko/serve](https://github.com/marko-js/cli/blob/master/packages/serve/README.md) for an updated zero config Marko setup!

# marko-starter-gh-pages

This module is used for easily publishing [marko-starter](https://github.com/marko-js/marko-starter)
websites to [GitHub pages](https://pages.github.com/).

## Installation

```bash
npm install @marko/starter-gh-pages
```

## API Usage

```js
const markoPages = require("@marko/starter-gh-pages");

(async function () {
  await markoPages.publish({
    ...
  })
});
```

## CLI Usage

```
Usage: marko-starter-gh-pages [options]

Examples:

  With a commit message:
     marko-starter-gh-pages -m "Hello this is my commit!"

  With redirects:
     marko-starter-gh-pages -e /docs/home /docs /admin/home /admin

Options:

  --build-dir -b Directory where the built files will reside. Defaults to "./dist" [string]

--project-dir -p Directory of the project.js file. Defaults to "process.cwd()" [string]

   --base-url -u Base URL for the page (e.g. /my-project) [string]

  --redirects -e List of URLs to redirect and where to redirect to (--redirects /docs/home /docs) [string]

     --branch -B Branch to push to (defaults to "gh-pages") [string]

       --dest -d The folder to publish to do n the destination branch. Defaults to the root of the repository. [string]

       --repo -r Repository to push to. Defaults to the current working directory with "origin" remote. [string]

     --remote -R Name of the remote to push to (defaults to "origin") [string]

        --tag -t Git tag to create with the build. None created if not used. [string]

    --message -m Commit message (defaults to "Updates") [string]

       --help -h Show all properties [string]
```
