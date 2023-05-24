import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from "next";
import { serialize } from "~/mdx/serialize"
import matter from "gray-matter"

import { PageFrontendOptions, PageProps } from "./page";

import walk from "~/util/walk";
import resolvePage from "~/util/resolvePage";
import path from "node:path";
import normalizePageURL from "~/util/normalizePageURL";

function pageGetStaticProps(dir: string, frontendOptions?: PageFrontendOptions){
	return async function(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {
		const file = context.params!.file! as string;
		const mdx = matter((await import(`~/pages/${dir}/${file}.mdx`)).default);

		if(mdx.data.published === false){
			return {
				notFound: true,
			}
		}
		return {
			props: {
				source: await serialize(mdx.content),
				data: mdx.data,
				options: frontendOptions || null
			},
		}
	}
}

function pageGetStaticPaths(dir: string){
	return async function(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
		const files = (await walk(resolvePage(dir)))
			.filter(filename => path.extname(filename) === ".mdx")
			.map(filename => path.basename(filename, path.extname(filename)))

		return {
			paths: files.map(filename => ({params: {file: filename}})),
			fallback: false,
		}
	}
}

export type CollectionPageBackendOptions = {
	dir: string | URL,
	frontendOptions?: PageFrontendOptions
}

export function collectionPageBackend({dir, frontendOptions}: CollectionPageBackendOptions){
	dir = normalizePageURL(dir);
	return {
		getStaticProps: pageGetStaticProps(dir, frontendOptions),
		getStaticPaths: pageGetStaticPaths(dir)
	}
}