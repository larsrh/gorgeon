/* global suite, test */
import renderMarkdown from "../src/markdown.js";
import { strictEqual as assertSame } from "assert";

suite("Markdown extension");

test("rendering", async () => {
	let txt = `
Hello World
===========

lorem ipsum
dolor _sit_ amet

* foo
* bar

…
	`;
	assertSame(await renderMarkdown(txt, { fragIDs: true }), `
<h1 id="hello-world">Hello World</h1>
<p>lorem ipsum
dolor <em>sit</em> amet</p>
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<p>…</p>
	`.trim() + "\n");
});

test("custom heading IDs", async () => {
	let md = `
# Hello World
lipsum
	`;
	assertSame(await renderMarkdown(md, { fragIDs: txt => `~${txt}~` }), `
<h1 id="~Hello World~">Hello World</h1>
<p>lipsum</p>
	`.trim() + "\n");
});
