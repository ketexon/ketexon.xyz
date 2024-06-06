export function gaussian(mean: number = 0, stdev: number = 1) {
	// Box-Muller transform
    const u1 = 1 - Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2*Math.PI*u2);
    return z * stdev + mean;
}