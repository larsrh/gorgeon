import parse from "./parser.js";
import { abort } from "../util.js";

export default class ContentPage {
	constructor(filepath) {
		this.filepath = filepath;
	}

	async render(layouts, transforms) {
		let { filepath } = this;
		let { meta, blocks } = await parse(filepath);

		let context = { origin: filepath };
		blocks = await Promise.all(blocks.
			map(blk => blk.render(transforms, context)));
		let html = blocks.join("");

		let { layout } = meta;
		if(layout) {
			let id = layout;
			layout = layouts[id];
			if(!layout) {
				abort(`ERROR: unknown layout \`${id}\` in \`${filepath}\``);
			}
		} else {
			layout = layouts.default;
		}
		return layout(meta, html);
	}
}
