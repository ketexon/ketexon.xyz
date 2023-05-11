import { GetStaticPropsContext, GetStaticPropsResult } from "next";

import { walkCollectionPages } from "~/collections/pageBrowserBackend";

import { CollectionBrowserProps } from "~/collections/collectionBrowser";
import { PageBrowserGetStaticPropsOptions } from "~/collections/pageBrowserBackend"

import normalizePageURL from "~/util/normalizePageURL"
import titleCase from "~/util/titleCase";

import path from "node:path";

const defaultNPreviewPages = 3;

export type CollectionBrowserBackendOptions = {
	title: string,
	collections: PageBrowserGetStaticPropsOptions[],
	nPreviewPages?: number
}

export function collectionBrowserBackend({title, collections, nPreviewPages}: CollectionBrowserBackendOptions) {
	nPreviewPages = nPreviewPages ?? defaultNPreviewPages;
	return {
		getStaticProps: async function({}: GetStaticPropsContext): Promise<GetStaticPropsResult<CollectionBrowserProps>> {
			return {
				props: {
					collections: (
						await Promise.all(
							collections.map(async({dir, title}) => ({
								dir: normalizePageURL(dir),
								title: title ?? titleCase(path.basename(normalizePageURL(dir))),
								pages: (await walkCollectionPages(normalizePageURL(dir))).slice(0, nPreviewPages)
							}))
						)
					),
					title
				}
			}
		}
	}
}