import path from "path";

export let fileExt = filepath => path.extname(filepath).substr(1);

export function abort(msg, code = 1) {
	console.error(msg);
	process.exit(code);
}
