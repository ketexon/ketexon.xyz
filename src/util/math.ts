export function clamp(x, a, b): number {
	return x < a ? a : x > b ? b : x;
}

export function clamp01(x): number {
	return clamp(x, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
	return clamp01(t) * (b - a) + a;
}