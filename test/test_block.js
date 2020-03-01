/* global suite, before, after, test */
import parse from "../src/page/parser.js";
import ContentBlock from "../src/page/block.js";
import { fixturePath, BufferedStream, wait, raise } from "./util.js";
import assert from "assert";

let { strictEqual: assertSame, deepStrictEqual: assertDeep } = assert;

let _error = console.error;
let _exit = process.exit;
let log = new BufferedStream();

suite("content blocks");

before(() => {
	console.error = (...msg) => void log.write(msg);
	process.exit = code => void raise(`[exit ${code}] ${log.read(true)}`);
});

after(() => {
	console.error = _error;
	process.exit = _exit;
});

test("rendering", async () => {
	let block = new ContentBlock("md", { id: "abc123" }, "lipsum");
	let res = await block.render({
		md: (txt, params, context) => `~${txt} ${JSON.stringify(params)}~`
	});
	assertSame(res, '~lipsum {"id":"abc123"}~');

	block = new ContentBlock("adoc", null, "lorem ipsum");
	res = await block.render({
		adoc: async (txt, params, context) => {
			await wait(10);
			return `~${txt} ${JSON.stringify(params)}~`;
		}
	});
	assertSame(res, "~lorem ipsum {}~");

	await assert.rejects(() => {
		return block.render({}, { origin: "/path/to/dummy" });
	}, /exit 1.*unknown format `adoc` for `.path.to.dummy`/);
});

test("default handler", async () => {
	let block = new ContentBlock("python", { id: "abc123" }, "lipsum");
	let context = { origin: "/path/to/dummy" };
	await assert.rejects(() => {
		return block.render({}, context);
	}, /exit 1.*unknown format `python` for `.path.to.dummy`/);

	let res = await block.render({
		default: (txt, params, context) => `~${txt} ${JSON.stringify(params)}~`
	}, context);
	assertSame(res, '~lipsum {"format":"python","id":"abc123"}~');
});

test("decomposition", async () => {
	let filepath = fixturePath("simple.md");
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
