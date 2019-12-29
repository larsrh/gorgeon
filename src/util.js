import path from "path";

export let fileExt = filepath => path.extname(filepath).substr(1);

// attempts to load a module, prompting the user to install the corresponding
// package if it is unavailable
export function load(pkg, errorMessage = "ERROR: missing package", supplier = pkg) {
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
