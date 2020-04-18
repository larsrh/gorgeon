"use strict";

let renderMarkdown = require("gorgeon-markdown");
let { makeTransform } = require("gorgeon-complate");
let { promises: fs } = require("fs");
let path = require("path");

let COMPLATE = makeTransform(__dirname);
let LAYOUT = path.resolve(__dirname, "layout.jsx");
LAYOUT = fs.readFile(LAYOUT, "utf8");

module.exports = {
	watchDirs: ["./content"],
	gorgeon: [{
		pages: ["./content/index.md", "./content/components.md"],
		targetDir: "./dist",
		layouts: {
			default: async (meta, html) => {
				html = await render(await LAYOUT, { params: meta, html });
				return html.trim();
			}
		},
		transforms: {
			md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
			complate: render
		}
	}],
	plugins: [path.resolve(__dirname, "../src/faucet.js")]
};

async function render(jsx, params, context) {
	let _render = await COMPLATE;
	return _render(jsx, params, context);
}
