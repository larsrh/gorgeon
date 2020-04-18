"use strict";

// ESM normalization for convenience, as for now this is primarily used in
// CommonJS environments (notably faucet-gorgeon)
require = require("esm")(module); // eslint-disable-line no-global-assign
module.exports = require("gorgeon/src/complate");
