import parse from "./parser.js";

export default class ContentPage {
	constructor(filepath) {
		this.filepath = filepath;
	}

	async render(layout, transforms) {
		let { filepath } = this;
		let { meta, blocks } = await parse(filepath);

		let context = { origin: filepath };
		blocks = await Promise.all(blocks.
			map(blk => blk.render(transforms, context)));
		let html = blocks.join("");

		return layout(meta, html);
	}
}
