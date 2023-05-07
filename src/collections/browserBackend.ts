import { GetStaticPropsContext, GetStaticPropsResult } from "next"

import walk from "~/util/walk"
import resolvePage from "~/util/resolvePage"
import path from "node:path"
import matter from "gray-matter"

import omit from "~/util/omit";

import { CollectionBrowserProps } from "./browser"

export type CollectionBrowserPage = {
	filename: string,
	matter: Omit<matter.GrayMatterFile<any>, "content" | "orig">
}

export type CollectionBrowserGetStaticPropsOptions = {
	dir: string,
	title: string
}

export async function walkCollectionPages(dir: string): Promise<CollectionBrowserPage[]> {
	const pages = (await Promise.all(
		(await walk(resolvePage(dir)))
			.filter(filename => path.extname(filename) === ".mdx")
			.map((filename): Promise<CollectionBrowserPage> =>
				import(`~/pages/${dir}/${path.basename(filename)}`).then(
					mod => ({
						filename: path.basename(filename, path.extname(filename)),
						matter: omit(matter(mod.default), "content", "orig"),
					})
				)
			)
		)).filter(({matter}) => matter.data.published !== false);

	pages.sort(({matter: aMatter}, {matter: bMatter}) => (aMatter.data.date as Date) < (bMatter.data.date as Date) ? -1 : 1);
	return pages;
}

export function collectionBrowserBackend({dir, title}: CollectionBrowserGetStaticPropsOptions) {
	return {
		getStaticProps: async function({}: GetStaticPropsContext): Promise<GetStaticPropsResult<CollectionBrowserProps>> {
			return {
				props: {
					pages: await walkCollectionPages(dir),
					title,
					dir
				},
			}
		}
	}
}