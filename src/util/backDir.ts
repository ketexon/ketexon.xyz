export default function backDir(dir: string): string {
	return dir.substring(0, dir.lastIndexOf("/"))
}