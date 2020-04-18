"use strict";

let renderMarkdown = require("gorgeon-markdown");
let { makeTransform } = require("gorgeon-complate");
let { promises: fs } = require("fs");
let path = require("path");

let complate = makeTransform(__dirname);

let LAYOUT = path.resolve(__dirname, "layout.jsx");
LAYOUT = fs.readFile(LAYOUT, "utf8");

module.exports = {
	watchDirs: ["./content"],
	gorgeon: [{
		pages: ["./content/index.md", "./content/components.md"],
		targetDir: "./dist",
		layouts: {
			default: async (meta, html) => {
				let render = await complate;
				html = await render(await LAYOUT, { params: meta, html });
				return html.trim();
			}
		},
		transforms: {
			md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
			complate: async (jsx, params, context) => {
				let render = await complate;
				return render(jsx, params);
			}
		}
	}],
	plugins: [path.resolve(__dirname, "../src/faucet.js")]
};
