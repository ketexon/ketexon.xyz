export default function omit<T extends {[K in U]: any}, U extends string>(obj: T, ...keys: U[]): Omit<T, U> {
	return Object.fromEntries(Object.entries(obj).filter(([k, _]) => !(keys as string[]).includes(k))) as Omit<T, U>;;
}