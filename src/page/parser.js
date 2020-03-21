import ContentBlock from "./block.js";
import { fileExt, abort } from "../util.js";
import txtParse from "lampenfieber";
import colonParse from "metacolon";

export default async function parse(filepath, options) {
	let { headers, body } = await colonParse(filepath);
	// determine format based on metadata or file extension
	let { format = fileExt(filepath), ...meta } = headers;
	if(!format) {
		abort(`ERROR: missing format for \`${filepath}\``);
	}

	let iblocks = {};
	let blocks = txtParse(body, { iblocks, ...options });
	iblocks = Object.entries(iblocks).
		reduce((memo, [id, { type, params, content }]) => {
			memo[id] = new ContentBlock(type, params, content);
			return memo;
		}, {});
	if(iblocks.length === 0) {
		iblocks = null;
	}

	// turn plain text into blocks with default format
	blocks = blocks.map(block => block.substr ?
		new ContentBlock(format, null, block, iblocks) :
		new ContentBlock(block.type, block.params, block.content));
	return { meta, blocks };
}
