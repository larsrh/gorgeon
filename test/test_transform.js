/* global suite, test */
import ContentPage from "../src/page/index.js";
import Bundle from "../src/complate/index.js";
import { fixturePath } from "./util.js";
import path from "path";
import { strictEqual as assertSame } from "assert";

suite("content transformation");

test("complate support", async () => {
	let filepath = fixturePath("componentized.md");
	let page = new ContentPage(filepath);
	let html = await page.render(document, {
		md: txt => `<p>${txt.trim()}</p>`,
		complate: (jsx, params, context) => {
			let bundle = new Bundle(path.dirname(context.origin));
			return bundle.renderString(jsx, "snippet.jsx", params);
		}
	});
	assertSame(html.replace(/\t/g, ""), `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>Hello World</title>
<body>
<h1>Hello World</h1>
<p>lorem ipsum
dolor sit amet</p><figure>

    <canvas  width="100"  height="100">blank canvas</canvas>

<figcaption>a blank canvas</figcaption>
</figure><p>consectetur adipisicing elit,
sed do eiusmod tempor</p>
</body>
</html>
`);
});

function document({ title }, html) {
	return `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>${title}</title>
<body>
	<h1>${title}</h1>
${html}
</body>
</html>
`;
}
