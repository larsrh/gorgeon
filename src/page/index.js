import parse from "./parser.js";
import { abort } from "../util.js";
import path from "path";

export default class ContentPage {
	constructor(filepath) {
		this.filepath = filepath;
	}

	async render(layouts, transforms, context) {
		let { meta, blocks } = await this._parse();
		let { filepath } = this;
		context = { ...context, origin: filepath };
		blocks = await Promise.all(blocks.
			map(blk => blk.render(transforms, context)));
		let html = blocks.join("");

		let layoutID = meta.layout || "default";
		let layout = layouts[layoutID];
		if(!layout) {
			abort(`ERROR: unknown layout \`${layoutID}\` in \`${filepath}\``);
		}
		return layout(meta, html);
	}

	async _parse() {
		if(!this._parsed) {
			this._parsed = await parse(this.filepath);
		}
		return this._parsed;
	}

	get slug() { // NB: async
		return determineSlug(this.filepath, this._parse());
	}
}

async function determineSlug(filepath, parsed) {
	let { meta } = await parsed;
	let { slug } = meta;
	if(slug) {
		return slug;
	}

	let filename = path.basename(filepath);
	let ext = path.extname(filename);
	let i = filename.lastIndexOf(ext);
	return filename.substr(0, i);
}
