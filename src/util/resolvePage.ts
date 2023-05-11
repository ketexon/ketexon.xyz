import path from "node:path"

export default function resolvePage(pagePath: string){
	return path.resolve("./public", "../src/pages", pagePath)
}