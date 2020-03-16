Gorgeon _/ˈɡaʊrɒn/_
===================

pluggable static-site generator


Getting Started
---------------

* `npm install gorgeon`
* see `samples` directory for usage


Contributing
------------

* ensure [Node](https://nodejs.org) is installed
* `npm install` downloads dependencies
* `npm test` runs the test suite and checks code for stylistic consistency


Releases
--------

NB: version numbers are incremented in accordance with
    [semantic versioning](https://semver.org)

1. `./bin/update-pkg` ensures dependencies are up to date
2. update version number in _all_ `package.json` files
3. commit as "v#.#.#"

        $ git commit -m "v`node -p -e 'require("./package.json").version'`"

    the commit description should also include a rationale, e.g. why a major
    version was required, and a list of significant changes

4. `./bin/release` publishes the new version
