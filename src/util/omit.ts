export default function omit<T extends {[K in U]: any}, U extends string>(obj: T, ...keys: U[]): Omit<T, U> {
	// keys.forEach(k => delete obj[k]);
	// return obj;
	const s = Object.fromEntries(Object.entries(obj).filter(([k, _]) => !(keys as string[]).includes(k))) as Omit<T, U>;
	console.log(s);
	console.log(keys);
	return s;
}