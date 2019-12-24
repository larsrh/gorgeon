/* global suite, test */
import { parse } from "../src/index.js";
import { fixturePath } from "./util.js";
import { deepStrictEqual as assertDeep } from "assert";

suite("content blocks");

test("decomposition", async () => {
	let filepath = fixturePath("dossier.md");
	let { meta, blocks } = await parse(filepath);
	assertDeep(meta, {
		lang: "en",
		title: "Hello World"
	});
	assertDeep(blocks.map(blk => blk.toJSON()), [{
		format: "md",
		params: {},
		content: "lorem ipsum\ndolor sit amet\n"
	}, {
		format: "html",
		params: {}, // eslint-disable-next-line max-len
		content: "<figure>\n    <canvas width=\"100\" height=\"100\">blank canvas</canvas>\n    <figcaption>a blank canvas</figcaption>\n</figure>"
	}, {
		format: "md",
		params: {},
		content: "\nconsectetur adipisicing elit,\nsed do eiusmod tempor"
	}]);
});
