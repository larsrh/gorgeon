"use strict";

let renderMarkdown = require("gorgeon-markdown");
let { makeTransform } = require("gorgeon-complate");
let { promises: fs } = require("fs");
let path = require("path");

let COMPLATE = makeTransform(__dirname);
let LAYOUT = path.resolve(__dirname, "layout.jsx");
LAYOUT = fs.readFile(LAYOUT, "utf8");

module.exports = Promise.all([COMPLATE, LAYOUT]).then(([complate, layout]) => ({
	watchDirs: ["./content"],
	gorgeon: [{
		pages: ["./content/index.md", "./content/components.md"],
		targetDir: "./dist",
		layouts: {
			default: async (meta, html) => {
				html = await complate(layout, { params: meta, html });
				return html.trim();
			}
		},
		transforms: {
			md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
			complate
		}
	}],
	plugins: ["faucet-pipeline-gorgeon"]
}));
