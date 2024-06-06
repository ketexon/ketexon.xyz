import path from "path";
import resolvePage from "~/util/resolvePage";

export function getPageNameFromFile(dir: string, file: string){
	const resolvedDir = resolvePage(dir);
	const parsed = path.parse(path.relative(resolvedDir, file));
	return parsed.name === "index" ? parsed.dir : parsed.name
}