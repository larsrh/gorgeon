import { load, abort } from "../util.js";
import vm from "vm";
import path from "path";

let DOCTYPE = "<!DOCTYPE html>\n";
let PLACEHOLDER = `%~${Math.random().toString().substr(2)}~%`;
let LAYOUT = (component, filepath, placeholder) => `
import { ${component} } from "${filepath}";

<${component} {...context}>${placeholder}</${component}>
`;

// generates a layout function for the given `component` name, to be imported
// from `filepath`, relative to `referenceDir`
// XXX: workaround for Rodunj's lack of support for document types and raw HTML
export async function makeRenderer(component, filepath, referenceDir) {
	if(/[^a-zA-Z0-9]/.test(component)) { // primitive heuristic
		abort("ERROR: layout component names must be alphanumeric; " +
				`\`${component}\` is invalid`);
	}
	if(filepath.includes('"')) {
		abort(`ERROR: invalid module path \`${component}\``);
	}
	let renderComponent = await makeTransform(referenceDir);
	let jsx = LAYOUT(component, filepath, PLACEHOLDER);

	return async function renderLayout(meta, html) {
		let _html = await renderComponent(jsx, meta);
		return DOCTYPE + _html.replace(PLACEHOLDER, html);
	};
}

export async function makeTransform(referenceDir) {
	let bundle = await makeBundle(referenceDir);
	return (jsx, params, context) => bundle.
		renderString(jsx, "snippet.jsx", { context: params });
}

export async function makeBundle(referenceDir) {
	// dynamic import here allows for static imports within target module
	let filepath = path.resolve(__dirname, "./bundling");
	let { default: VirtualBundle } = await load(filepath, "complate extension");

	let bundle = new VirtualBundle(referenceDir);
	bundle.renderString = renderString;
	return bundle;
}

async function renderString(code, filename, context = {}) {
	let { renderToString } = await load("rodunj/src/render", "complate extension");

	// TODO: generate unique file name to avoid potential race condition for
	//       concurrent access with identical sources?
	let id = this.virtualModule(filename, code);
	this.config.input.input = id; // FIXME: breaks encapsulation
	code = await this.compile();

	let sandbox = { ...context, console };
	let segments = vm.runInNewContext(code, sandbox);
	return renderToString(...segments);
}
