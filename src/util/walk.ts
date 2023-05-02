import fs from "node:fs/promises"
import path from "node:path"

export default async function walk(dir: string) {
    let files = await fs.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    })) as string[];

    return files.reduce((all: string[], folderContents) => all.concat(folderContents), []);
}