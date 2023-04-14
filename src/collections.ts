import * as fs from "node:fs/promises"
import * as path from "node:path"
import matter from "gray-matter"


export async function getCollections(collectionsRoot: string): Promise<string[]>{
	return fs.readdir(collectionsRoot)
		.then(entries => entries.reduce<Promise<string[]>>(
			async (arr: Promise<string[]>, entry: string) =>
				fs.stat(path.join(collectionsRoot, entry)).then(
					async stat => stat.isDirectory()
					? [...await arr, entry]
					: arr
				),
			new Promise((res, _) => res([]))
		))
}

export type CollectionConfig = {
	excludedFiles?: string[]
}


export async function getCollectionConfig(collectionsRoot: string, collection: string): Promise<CollectionConfig> {
	return new Promise((res, rej) =>
		fs.readFile(path.join(collectionsRoot, collection, "config.json"))
			.then(content => {
				new Promise((res, rej) => res(JSON.parse(content.toString())))
					.then(json => res(json as CollectionConfig))
					// error parsing json
					.catch(reason => rej(
						`Error in config file ${path.join(collectionsRoot, collection, "config.json")}: ${reason}`,
					))
			})
			// cant read file
			.catch(reason => {
				res({} as CollectionConfig)
			})
	);
}

export async function getAllLeafs(parent): Promise<string[]> {
	return (await (async () =>
		// Promise<string[]>[] => Promise<string[][]>
		Promise.all((await fs.readdir(parent))
			.map(async child => {
				const childPath = `${parent}/${child}`;
				return (await fs.stat(childPath)).isDirectory()
					? (await getAllLeafs(childPath)) as string[]
					: [childPath];
			})
		)
	)()).flat() // string[][] => string[]
}

export type PageParams = {
	collection: string,
	id: string,
}

export type Page = {
	params: PageParams,
	frontMatter: {[k: string]: any},
	content: string,
}

export async function getCollectionPages(collectionsRoot: string): Promise<Page[]>{
	const collections: string[] = await getCollections(collectionsRoot);

	const collectionConfigs = Object.fromEntries(
		await Promise.all(collections.map(async collection => [collection, await getCollectionConfig(collectionsRoot, collection)]))
	);

	// get all files in collection
	return Promise.all(
		collections.map(
			async collection => ({
				collection,
				documentPaths: (await getAllLeafs(path.join(collectionsRoot, collection))).filter(
					documentPath => path.extname(documentPath) == ".md"
				)
			})
		)
	).then(documents => Promise.all(documents.map(({collection, documentPaths}) =>
		Promise.all(documentPaths.map(async documentPath => {
			const {data: frontMatter, content} = matter(await fs.readFile(documentPath))
			return {
				collection,
				id: frontMatter.permalink || path.basename(documentPath, path.extname(documentPath)),
				path: documentPath,
				frontMatter,
				content
			}
		}))
	))).then(pages => pages.flat()
		.filter(({collection, frontMatter, path: documentPath}) =>
			(process.env.showUnpublished || (frontMatter.published ?? true)) // make sure published
			// make sure not excluded
			&& !(collectionConfigs[collection].excludedFiles || []).includes(path.resolve(documentPath))
		)
		.map(({collection, id, frontMatter, content}): Page => ({
			params: {
				collection,
				id,
			} as PageParams,
			frontMatter,
			content
		}))
	)
}

export async function getPageFromParams(collectionsRoot: string, params: PageParams): Promise<Page | undefined> {
	return getCollectionPages(collectionsRoot).then(
		paths => paths.find(({params: pageParams}) => pageParams.id == params.id && pageParams.collection == params.collection)
	)
}