export default class ContentBlock {
	constructor(format, params, content) {
		Object.assign(this, {
			format,
			params: params || {},
			content
		});
	}

	toJSON() {
		let { format, params, content } = this;
		return { format, params, content };
	}
}
