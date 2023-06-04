export function hexToRGBA(hex: string, scale01: boolean = true){
	return hex.replace(
		/^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i,
		(m, r, g, b, a) => `#${r}${r}${g}${g}${b}${b}` + a ? `${a}${a}` : ""
	).substring(1)
		.padEnd(8, 'f')
		.match(/.{2}/g)!
		.map(x => parseInt(x, 16) * (scale01 ? 1/255 : 1)) as [number, number, number] | [number, number, number, number]
}