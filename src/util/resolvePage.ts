import path from "node:path"

export default function resolvePage(...paths: string[]){
	return path.resolve("./public", "../src/pages", ...paths);
}