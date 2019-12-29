/* global suite, test */
import ContentPage from "../src/page/index.js";
import renderMarkdown from "../src/markdown.js";
import { fixturePath } from "./util.js";
import { strictEqual as assertSame } from "assert";

suite("content pages");

test("rendering", async () => {
	let filepath = fixturePath("simple.md");
	let page = new ContentPage(filepath);
	let html = await page.render(document, {
		md: txt => renderMarkdown(txt),
		html: html => html
	});
	assertSame(html, `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<title>Hello World</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
	<h1>Hello World</h1>
<p>lorem ipsum
dolor sit amet</p>
<figure>
    <canvas width="100" height="100">blank canvas</canvas>
    <figcaption>a blank canvas</figcaption>
</figure><p>consectetur adipisicing elit,
sed do eiusmod tempor</p>

</body>

</html>
	`.trim());
});

test("custom default format", async () => {
	let filepath = fixturePath("custom.md");
	let page = new ContentPage(filepath);
	let html = await page.render((params, html) => `----\n${html}\n----`, {
		txt: txt => txt,
		html: html => html
	});
	assertSame(html, `
----
lorem ipsum
dolor sit amet
<hr>
consectetur adipisicing elit,
sed do eiusmod tempor
----
	`.trim());
});

function document({ lang, title }, html) {
	return `
<!DOCTYPE html>
<html lang="${lang}">

<head>
	<meta charset="utf-8">
	<title>${title}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
	<h1>${title}</h1>
${html}
</body>

</html>
	`.trim();
}
