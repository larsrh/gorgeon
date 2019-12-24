import ContentBlock from "./block.js";
import { fileExt, abort } from "../util.js";
import txtParse from "lampenfieber";
import colonParse from "metacolon";

export default async function parse(filepath) {
	let { headers, body } = await colonParse(filepath);
	// determine format based on metadata or file extension
	let { format = fileExt(filepath), ...meta } = headers;
	if(!format) {
		abort(`ERROR: missing format for \`${filepath}\``);
	}
	// turn plain text into blocks with default format
	let blocks = txtParse(body).map(block => block.substr ?
		new ContentBlock(format, null, block) :
		new ContentBlock(block.type, block.params, block.content));
	return { meta, blocks };
}
