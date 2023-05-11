export default function titleCase(s: string): string {
	return s.split(" ").map(word => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word).join(" ")
}