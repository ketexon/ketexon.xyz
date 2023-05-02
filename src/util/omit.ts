export default function omit<T extends Object, U extends string>(obj: T, ...keys: U[]): Omit<T, U> {
	keys.forEach((key: string) => delete obj[key]);
	return obj;
}