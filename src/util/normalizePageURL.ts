import path from "node:path";
import { fileURLToPath } from "node:url";
import memoizeOne from "memoize-one";


export default memoizeOne(function(url: string | URL): string {
	return (url instanceof URL
		? path.relative(path.resolve("./public", "../src/pages"), path.dirname(fileURLToPath(url)))
		: url).split(path.sep).join(path.posix.sep);
}) as (url: string | URL) => string