import path from "path";

let RE_CHARS = /[\\^$.*+?()[\]{}|]/g;
let RE_CHARS_ANY = RegExp(RE_CHARS.source);

// escapes a string for use within a regular expression
// adapted from lodash (MIT License)
// eslint-disable-next-line max-len
// https://github.com/lodash/lodash/blob/588bf3e20db0ae039a822a14a8fa238c5b298e65/escapeRegExp.js
export let escapeRE = str => (str && RE_CHARS_ANY.test(str)) ?
	str.replace(RE_CHARS, "\\$&") : str;

export let fileExt = filepath => path.extname(filepath).substr(1);

// attempts to load a module, prompting the user to install the corresponding
// package if it is unavailable
export function load(pkg, supplier = pkg, errorMessage = "ERROR: missing package") {
	try {
		return import(pkg);
	} catch(err) {
		if(err.code !== "MODULE_NOT_FOUND") {
			throw err;
		}
		abort(`${errorMessage} - please install \`${supplier}\``);
	}
}

export function abort(msg, code = 1) {
	console.error(msg);
	process.exit(code);
}
