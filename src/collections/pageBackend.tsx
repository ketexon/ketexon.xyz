import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from "next";
import { serialize } from "~/mdx/serialize"
import matter from "gray-matter"

import { CollectionPageProps } from "./page";

import walk from "~/util/walk";
import resolvePage from "~/util/resolvePage";
import path from "node:path";

function collectionPageGetStaticProps(dir: string){
	return async function(context: GetStaticPropsContext): Promise<GetStaticPropsResult<CollectionPageProps>> {
		const file = context.params!.file! as string;
		const mdx = matter((await import(`~/pages/${dir}/${file}.mdx`)).default);
		console.log(mdx)
		if(mdx.data.published === false){
			return {
				notFound: true,
			}
		}
		return {
			props: {
				source: await serialize(mdx.content),
				data: mdx.data
			},
		}
	}
}

function collectionPageGetStaticPaths(dir: string){
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
	dir: string
}

export function collectionPageBackend({dir}: CollectionPageBackendOptions){
	return {
		getStaticProps: collectionPageGetStaticProps(dir),
		getStaticPaths: collectionPageGetStaticPaths(dir)
	}
}