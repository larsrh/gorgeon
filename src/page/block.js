import { abort } from "../util.js";

export default class ContentBlock {
	constructor(format, params, content, iblocks) {
		Object.assign(this, {
			format,
			params: params || {},
			content,
			...(iblocks && { iblocks })
		});
	}

	// `transforms` is a `{ format: transform }` object; the matching transform
	// is invoked with `context`
	// `context.origin` is the original content's file path
	async render(transforms, context) {
		let { format, params } = this;
		let transform = transforms[format];
		if(!transform) {
			transform = transforms.default || abort("ERROR: " +
					`unknown format \`${format}\` for \`${context.origin}\``);
			params = { format, ...params };
		}

		let txt = transform(this.content, params, context);
		let { iblocks } = this;
		return !iblocks ? txt :
			transformInlineBlocks(txt, iblocks, transforms, context);
	}

	toJSON() {
		let { format, params, content } = this;
		return { format, params, content };
	}
}

async function transformInlineBlocks(txt, iblocks, ...args) {
	return Object.entries(iblocks).reduce(async (memo, [id, block]) => {
		let txt = await block.render(...args);
		memo = await memo;
		return memo.replace(id, txt);
	}, txt);
}
