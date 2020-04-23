import { escapeRE, abort } from "../util.js";

let WHITESPACE_PREFIXES = {
	leading: "<",
	trailing: ">"
};

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

		let whitespace = this.whitespaceControl(format);
		if(whitespace) {
			({ format } = whitespace);
		}

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

	// determines whether to strip leading and/or trailing whitespace
	whitespaceControl(format = this.format) {
		let { leading, trailing } = WHITESPACE_PREFIXES;
		if(format.startsWith(leading)) {
			let _trailing = format.substr(1).startsWith(trailing);
			let { length } = leading;
			format = format.substr(_trailing ? length + trailing.length : length);
			leading = true;
			trailing = _trailing;
		} else if(format.startsWith(trailing)) {
			format = format.substr(trailing.length);
			trailing = true;
		} else {
			return false;
		}
		return {
			leading: leading === true,
			trailing: trailing === true,
			format
		};
	}
}

async function transformInlineBlocks(txt, iblocks, ...args) {
	iblocks = Object.entries(iblocks).map(async ([id, block]) => ({
		id,
		txt: await block.render(...args),
		whitespace: block.whitespaceControl()
	}));
	[txt, ...iblocks] = await Promise.all([txt].concat(iblocks));
	return iblocks.reduce((memo, { id, txt, whitespace }) => {
		let pattern = id;
		if(whitespace) {
			let { leading, trailing } = whitespace;
			if(leading || trailing) {
				leading = leading ? "\\s*" : "";
				trailing = trailing ? "\\s*" : "";
				pattern = new RegExp(`${leading}${escapeRE(id)}${trailing}`, "g");
			}
		}
		return memo.replace(pattern, txt);
	}, txt);
}
