import path from "path";

export let fixturePath = (name = "") => path.resolve(__dirname, "fixtures", name);

export class BufferedStream {
	constructor() {
		this._buffer = [];
	}

	write(msg) {
		this._buffer.push(msg);
	}

	read(reset) {
		let { _buffer } = this;
		if(reset) {
			this.reset();
		}
		return _buffer.flat().join(" ");
	}

	reset() {
		this._buffer = [];
	}
}

export function raise(msg) {
	throw new Error(msg);
}
