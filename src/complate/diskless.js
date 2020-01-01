import path from "path";

// Rollup plugin for virtual modules
// `referenceDir` is used for relative imports from diskless modules
// `modules` maps file names to source code
// NB: implicit file extensions are not supported from within virtual modules
export default (referenceDir, modules = new Map(), prefix = "diskless:") => ({
	name: "diskless",
	resolveId(importee, importer) {
		if(importer && importer.startsWith(prefix)) {
			let relative = /^\.?\.\//.test(importee); // starts with `./` or `../`
			return relative ? path.resolve(referenceDir, importee) : null;
		}
		return importee.startsWith(prefix) ? importee : null;
	},
	load(id) {
		if(!id.startsWith(prefix)) {
			return null;
		}

		let filename = id.substr(prefix.length);
		let code = modules.get(filename);
		if(code === undefined) {
			throw new Error(`missing diskless module: ${filename}`);
		}
		return code;
	},
	register(filename, code) {
		modules.set(filename, code);
		return prefix + filename;
	},
	deregister(filename) {
		return modules.delete(filename);
	},
	get prefix() {
		return prefix;
	}
});
