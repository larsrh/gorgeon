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
		default: (params, html) => `----\n${html.trim()}\n----`
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
});

test("transforms' secondary files", async () => {
	let rootDir = await mkdtemp();
	let site = new WebSite(rootDir, {
		default: (params, html) => `----\n${html.trim()}\n----`
	}, {
		md: txt => `md:${txt.length}\n`,
		html: async (code, params, context) => {
			let filename = await context.createSub("html", code);
			return `<a href="${filename}">${filename}</a>\n`;
		}
	});

	let filepath = fixturePath("subs.md");
	await site.createPage(filepath);

	let pageDir = path.join(rootDir, "subs");
	let readFile = filename => {
		let filepath = path.join(pageDir, filename);
		return fs.readFile(filepath, "utf8");
	};

	let html = await readFile("index.html");
	assertSame(html, `
----
md:27
<a href="0.html">0.html</a>
md:53
<a href="1.html">1.html</a>
----
	`.trim());

	html = await readFile("0.html");
	assertSame(html, `
<figure>
    <canvas width="100" height="100">blank canvas</canvas>
    <figcaption>a blank canvas</figcaption>
</figure>
	`.trim());

	html = await readFile("1.html");
	assertSame(html, `
<figure>
    <canvas width="10" height="10">empty canvas</canvas>
    <figcaption>an empty canvas</figcaption>
</figure>
	`.trim());

	await fs.rmdir(rootDir, { recursive: true });
});

async function mkdtemp() {
	return fs.mkdtemp(path.join(os.tmpdir(), "gorgeon-"));
}
