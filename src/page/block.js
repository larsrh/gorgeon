import { abort } from "../util.js";

export default class ContentBlock {
	constructor(format, params, content) {
		Object.assign(this, {
			format,
			params: params || {},
			content
		});
	}

	// `transforms` is a `{ format: transform }` object; the matching transform
	// is invoked with `context`
	// `context.origin` is the original content's file path
	render(transforms, context) {
		let { format, params } = this;
		let transform = transforms[format];
		if(!transform) {
			transform = transforms.default || abort("ERROR: " +
					`unknown format \`${format}\` for \`${context.origin}\``);
			params = { format, ...params };
		}
		return transform(this.content, params, context);
	}

	toJSON() {
		let { format, params, content } = this;
		return { format, params, content };
	}
}
