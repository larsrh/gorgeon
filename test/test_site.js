/* global suite, test */
import WebSite from "../src/site.js";
import { fixturePath } from "./util.js";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import assert from "assert";

let { strictEqual: assertSame } = assert;

suite("web sites");

test("page creation", async () => {
	let rootDir = await mkdtemp();
	let site = new WebSite(rootDir, {
		default: (meta, html) => `----\n${html.trim()}\n----`
	}, {
		md: txt => `md:${txt.length}\n`,
		html: code => `raw:${code.length}\n`
	});

	let filepath = fixturePath("simple.md");
	let page = await site.createPage(filepath);
	let html = await fs.readFile(page, "utf8");

	assertSame(page, path.join(rootDir, "simple", "index.html"));
	assertSame(html, `
----
md:27
raw:121
md:52
----
	`.trim());

	await assert.rejects(async () => {
		await site.createPage(filepath);
	}, { code: "EEXIST" });

	await assert.doesNotReject(async () => {
		await site.createPage(filepath, { overwrite: true });
	});

	await fs.rmdir(rootDir, { recursive: true });
});

async function mkdtemp() {
	return fs.mkdtemp(path.join(os.tmpdir(), "gorgeon-"));
}
