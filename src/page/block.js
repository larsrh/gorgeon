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
		let { format } = this;
		let transform = transforms[format];
		if(!transform) {
			abort(`ERROR: unknown format \`${format}\` for \`${context.origin}\``);
		}
		return transform(this.content, this.params, context);
	}

	toJSON() {
		let { format, params, content } = this;
		return { format, params, content };
	}
}
