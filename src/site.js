import ContentPage from "./page/index.js";
import { promises as fs } from "fs";
import path from "path";

export default class WebSite {
	constructor(rootDir, layouts, transforms) {
		this.root = rootDir;
		this.layouts = layouts;
		this.transforms = transforms;
	}

	async createPage(filepath, { overwrite } = {}) {
		let page = new ContentPage(filepath);
		let targetDir = path.resolve(this.root, await page.slug);
		await fs.mkdir(targetDir, { recursive: true });

		let subs = 0;
		let flag = overwrite ? "w" : "wx";
		let html = await page.render(this.layouts, this.transforms, {
			targetDir,
			createSub: async (fileExtension, data) => { // TODO: rename?
				let filename = `${subs}.${fileExtension}`;
				subs++;
				let filepath = path.resolve(targetDir, filename);
				await fs.writeFile(filepath, data, { flag });
				return filename;
			}
		});
		filepath = path.resolve(targetDir, "index.html");
		await fs.writeFile(filepath, html, { flag });
		return filepath;
	}
}
