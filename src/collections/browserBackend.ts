import { GetStaticPropsContext, GetStaticPropsResult } from "next"

import walk from "~/util/walk"
import resolvePage from "~/util/resolvePage"
import path from "node:path"
import matter from "gray-matter"

import omit from "~/util/omit";

import { CollectionBrowserProps, CollectionBrowserPage } from "./browser"

export type CollectionBrowserGetStaticPropsOptions = {
	dir: string,
	title: string
}

export function collectionBrowserBackend({dir, title}: CollectionBrowserGetStaticPropsOptions) {
	return {
		getStaticProps: async function({}: GetStaticPropsContext): Promise<GetStaticPropsResult<CollectionBrowserProps>> {
			const definitions = (await Promise.all(
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
				)).filter(({matter}) => matter.data.published !== false)

			return {
				props: {
					pages: definitions,
					title,
					dir
				},
			}
		}
	}
}