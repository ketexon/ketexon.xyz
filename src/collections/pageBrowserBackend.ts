import { GetStaticPropsContext, GetStaticPropsResult } from "next"

import walk from "~/util/walk"
import resolvePage from "~/util/resolvePage"
import path from "node:path"
import matter from "gray-matter"

import omit from "~/util/omit";
import normalizePageURL from "~/util/normalizePageURL";
import titleCase from "~/util/titleCase"

import { PageBrowserProps } from "./pageBrowser"
import backDir from "~/util/backDir"

export type PageBrowserPage = {
	filename: string,
	matter: Omit<matter.GrayMatterFile<any>, "content" | "orig">
}

export type PageBrowserGetStaticPropsOptions = {
	dir: string | URL,
	generateBackPage?: boolean,
	pinnedPages?: Partial<PageBrowserPage>[],
	title?: string
}

export async function walkCollectionPages(dir: string): Promise<PageBrowserPage[]> {
	const pages = (await Promise.all(
		(await walk(resolvePage(dir)))
			.filter(filename => path.extname(filename) === ".mdx")
			.map((filename): Promise<PageBrowserPage> =>
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

export function pageBrowserBackend({dir, pinnedPages, generateBackPage, title}: PageBrowserGetStaticPropsOptions) {
	generateBackPage ??= true;
	const dirString = normalizePageURL(dir);
	if(title === undefined){
		title = titleCase(path.basename(dirString));
	}
	return {
		getStaticProps: async function({}: GetStaticPropsContext): Promise<GetStaticPropsResult<PageBrowserProps>> {
			const pages = await walkCollectionPages(dirString);
			return {
				props: {
					pages,
					pinnedPages: pinnedPages ? pages.filter(
						page => pinnedPages.some(
							pinned => pinned.filename === page.filename
								|| pinned.matter && page.matter && Object.entries(page.matter.data).every(
									entry => Object.entries(pinned.matter!.data).includes(entry)
								)
						)
					) : [],
					title: title as string,
					dir: dirString,
					backPage: backDir(dirString),
				},
			}
		}
	}
}